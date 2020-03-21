import 'reflect-metadata';

export const metadataKey = Symbol('init');

export type metadataType = { context: string; key: string; type: new () => any; value: any };

export function registerProperty(target: object, propertyKey: string, className: new () => any): void {
    let properties: metadataType[] = Reflect.getMetadata(metadataKey, target);

    if (properties) {
        properties.push({ context: target.constructor.name, key: propertyKey, type: className, value: null });
    } else {
        properties = [{ context: target.constructor.name, key: propertyKey, type: className, value: null }];
        Reflect.defineMetadata(metadataKey, properties, target);
    }
}
