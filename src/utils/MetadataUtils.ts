import 'reflect-metadata'

export const METADATA_KEY = Symbol('init')
export type MetadataType = { context: string; key: string; type: new () => unknown; value: unknown }

export class MetadataUtils {
  public static registerProperty(target: object, propertyKey: string, className: new () => unknown): void {
    let properties: MetadataType[] = Reflect.getMetadata(METADATA_KEY, target)

    if (properties) {
      properties.push({ context: target.constructor.name, key: propertyKey, type: className, value: null })
    } else {
      properties = [{ context: target.constructor.name, key: propertyKey, type: className, value: null }]
      Reflect.defineMetadata(METADATA_KEY, properties, target)
    }
  }

  public static getDecoratedProperties<T>(origin: T): MetadataType[] {
    const properties: MetadataType[] = Reflect.getMetadata(METADATA_KEY, origin)
    properties?.forEach(p => (p.value = origin[p.key]))
    return properties ?? []
  }
}
