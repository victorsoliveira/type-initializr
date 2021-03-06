export class TypeUtils {
  static isInitializable(type: unknown): boolean {
    if (type) {
      const typeName = this.getTypeName(type)
      return !this.getWellKnownJsTypes().some(t => t.toLowerCase() === typeName?.toLowerCase())
    }
    return false
  }

  static getWellKnownJsTypes(): string[] {
    return ['boolean', 'number', 'string', 'object', 'undefined', 'function', 'null', 'symbol'].map(t =>
      t.toLowerCase(),
    )
  }

  static getTypeName(prototype: unknown): string | undefined | null {
    return prototype?.constructor?.name
  }
}
