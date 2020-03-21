import 'reflect-metadata';

import { TypeUtils } from "./TypeUtils";

const metadataKey = Symbol('prop');
type metadataType = {context: string, key: string, type: new()=>any, value: any};

export function prop(className: new()=>any) {
  function decorate(target: any, propertyKey: string): void {
    return registerProperty(target, propertyKey, className);
  }
  return decorate;
}

function registerProperty(target: object, propertyKey: string, className: new()=>any): void {
  
  let properties: metadataType[] = Reflect.getMetadata(metadataKey, target);

  if (properties) {
    properties.push({context: target.constructor.name, key: propertyKey, type: className, value: null});
  } else {
    properties = [{context: target.constructor.name, key: propertyKey, type: className , value: null}];
    Reflect.defineMetadata(metadataKey, properties, target);
  }
}

export type TypeInitialzrConfig = { overrideOnMatch: boolean; } | null;
type DecotatedParent = { instance: any, propName: string };

export class TypeInitialzr {
	
	#config: TypeInitialzrConfig;
  result: any;

	constructor(private config: TypeInitialzrConfig = null){
		this.#config = this.config ?? { overrideOnMatch: true };
	}

	public init<K, T extends K>(ctor: new() => T, props: K, parent: DecotatedParent | null = null): T {

    this.result = new ctor();
    let decorations = this.getDecoratedProperties(this.result) ?? [];

    if (parent) {
      parent.instance[parent.propName] = Object.assign(this.result, props);
    }

    this.result = parent?.instance ?? Object.assign(this.result, props);
    
    if (decorations.length > 0) {
      this.result = this.resolveDecoratedProperties(decorations, props, this.result);
    }

    return this.result as T;
  }

  private resolveDecoratedProperties<T,K>(metadata: metadataType[], props: K, parent: T): any {

      metadata.forEach(m => {

        if (Object.keys(props).some(p => p == m.key)) {

          let currentParent = parent;
          let currentPrototype = m.type.prototype;

          if (m.context !== currentParent?.constructor.name) {
            for(let key in parent) {
              if(m.context === parent[key]?.constructor.name) {
                currentParent = parent[key] as any;
              }
            }
          }

          if (TypeUtils.isInitializable(currentPrototype)) {
            return this.init(currentPrototype.constructor, props[m.key], {instance: currentParent, propName: m.key});
          }
        }
      });

      return parent;
  }

  private getDecoratedProperties<T>(origin: T): metadataType[] {
    const properties: metadataType[] = Reflect.getMetadata(metadataKey, origin);
    properties?.forEach(p => p.value = origin[p.key]);
    return properties;
  }
}
