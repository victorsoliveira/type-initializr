import { TypeUtils } from './utils/TypeUtils';
import { MetadataUtils, MetadataType } from './utils/MetadataUtils';

type ParentContext = { instance: any; propName: string };

export function init(className: new () => any): (target: any, propertyKey: string) => void {
    function decorate(target: any, propertyKey: string): void {
        return MetadataUtils.registerProperty(target, propertyKey, className);
    }
    return decorate;
}

export class TypeInitialzr {

    private static result: any;

    public static init<K, T extends K>(ctor: new () => T, props: K, parent: ParentContext | null = null): T {
        this.result = new ctor();
        const decorations = MetadataUtils.getDecoratedProperties(this.result) ?? [];

        if (parent) {
            parent.instance[parent.propName] = Object.assign(this.result, props);
        }

        this.result = parent?.instance ?? Object.assign(this.result, props);

        if (decorations.length > 0) {
            this.result = this.resolveDecoratedProperties(decorations, props, this.result);
        }

        return this.result as T;
    }

    private static resolveDecoratedProperties<T, K>(metadataTypes: MetadataType[], props: K, parent: T): any {

        metadataTypes.forEach(metadata => {

            if (Object.keys(props).some(p => p === metadata.key)) {

                const currentPrototype = metadata.type.prototype;

                let currentParent = parent;

                if (metadata.context !== currentParent?.constructor.name) {
                    for (const key in parent) {
                        if (metadata.context === parent[key]?.constructor.name) {
                            currentParent = parent[key] as any;
                        }
                    }
                }

                if (TypeUtils.isInitializable(currentPrototype)) {
                    return this.init(currentPrototype.constructor, props[metadata.key], {
                        instance: currentParent,
                        propName: metadata.key,
                    });
                }
            }

        });

        return parent;
    }
}
