import { TypeUtils } from './TypeUtils';
import { registerProperty, metadataType, metadataKey } from './MetadataUtils';

type CurrentParent = { instance: any; propName: string };

// Decorator Factory
export function init(className: new () => any): (target: any, propertyKey: string) => void {
    function decorate(target: any, propertyKey: string): void {
        return registerProperty(target, propertyKey, className);
    }
    return decorate;
}

export class TypeInitialzr {
    private static result: any;

    public static init<K, T extends K>(ctor: new () => T, props: K, parent: CurrentParent | null = null): T {
        this.result = new ctor();
        const decorations = this.getDecoratedProperties(this.result) ?? [];

        if (parent) {
            parent.instance[parent.propName] = Object.assign(this.result, props);
        }

        this.result = parent?.instance ?? Object.assign(this.result, props);

        if (decorations.length > 0) {
            this.result = this.resolveDecoratedProperties(decorations, props, this.result);
        }

        return this.result as T;
    }

    public static resolveDecoratedProperties<T, K>(metadataTypes: metadataType[], props: K, parent: T): any {
        Object.keys(props).forEach(p => {
            if (metadataTypes.some(m => m.key === p)) {
                const metadata = metadataTypes.find(mt => mt.key === p);
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

    private static getDecoratedProperties<T>(origin: T): metadataType[] {
        const properties: metadataType[] = Reflect.getMetadata(metadataKey, origin);
        properties?.forEach(p => (p.value = origin[p.key]));
        return properties;
    }
}
