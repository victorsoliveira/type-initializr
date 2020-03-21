import { TypeUtils } from './utils/TypeUtils'
import { MetadataUtils, MetadataType } from './utils/MetadataUtils'

type ParentContext = { instance: unknown; propName: string }

export function init(className: new () => unknown): (target: object, propertyKey: string) => void {
  function decorate(target: object, propertyKey: string): void {
    return MetadataUtils.registerProperty(target, propertyKey, className)
  }
  return decorate
}

export class TypeInitialzr {
  private static result: unknown

  public static init<K, T extends K>(ctor: new () => T, props: K, parent: ParentContext | null = null): unknown {
    this.result = new ctor()
    const decorations = MetadataUtils.getDecoratedProperties(this.result) ?? []

    if (parent) {
      parent.instance[parent.propName] = Object.assign(this.result, props)
    }

    this.result = parent?.instance ?? Object.assign(this.result, props)

    if (decorations.length > 0) {
      this.result = this.resolveDecoratedProperties(decorations, props, this.result)
    }

    return this.result
  }

  private static resolveDecoratedProperties<T, K>(metadataTypes: MetadataType[], props: K, parent: T): T {
    metadataTypes.forEach(metadata => {
      if (Object.keys(props).some(p => p === metadata.key)) {
        const currentPrototype = metadata.type.prototype

        let currentParent: unknown = parent

        if (metadata.context !== currentParent?.constructor.name) {
          for (const key in parent) {
            if (metadata.context === parent[key]?.constructor.name) {
              currentParent = parent[key]
            }
          }
        }

        if (TypeUtils.isInitializable(currentPrototype)) {
          return this.init(currentPrototype.constructor, props[metadata.key], {
            instance: currentParent,
            propName: metadata.key,
          })
        }
      }
    })

    return parent
  }
}
