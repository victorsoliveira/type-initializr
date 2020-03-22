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
  private static result

  /**
   * Retorna uma nova instância do tipo TInstance carregada com o objeto anônimo do tipo TPayload
   *
   * @param ctor - Tipo instânciável (classe) do tipo TInstance
   * @param payload - Objeto anônimo do tipo TPayload
   * @returns Instância do tipo TInstance carregada com as informações passadas no objeto anônimo do tipo TPayload
   *
   **/
  public static init<TInstance extends TPayload, TPayload>(ctor: new () => TInstance, payload: TPayload): TInstance {
    return this.resolve(ctor, payload)
  }

  private static resolve<T extends P, P>(ctor: new () => T, payload: P, parent: ParentContext | null = null): T {
    this.result = new ctor()
    const decorations = MetadataUtils.getDecoratedProperties(this.result) ?? []

    if (parent) {
      parent.instance[parent.propName] = Object.assign(this.result, payload)
    }

    this.result = parent?.instance ?? Object.assign(this.result, payload)

    if (decorations.length > 0) {
      this.result = this.resolveDecoratedProperties(decorations, payload, this.result as T)
    }

    return this.result as T
  }

  private static resolveDecoratedProperties<T, P>(metadataTypes: MetadataType[], payload: P, parent: T): T {
    metadataTypes.forEach(metadata => {
      if (Object.keys(payload).some(p => p === metadata.key)) {
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
          return this.resolve(currentPrototype.constructor, payload[metadata.key], {
            instance: currentParent,
            propName: metadata.key,
          })
        }
      }
    })

    return parent
  }
}
