export class TypeUtils {
    static isInitializable(type: any): boolean {
        if (type) {
            const typeName = this.getTypeName(type);
            return !this.getWellKnownJsTypes().some(t => t.toLowerCase() === typeName?.toLowerCase());
        }
        return false;
    }

    static getWellKnownJsTypes(): string[] {
        return ['boolean', 'number', 'string', 'object', 'undefined', 'function', 'null', 'symbol'].map(t =>
            t.toLowerCase(),
        );
    }

    static getTypeName(prototype: any): string | undefined {
        return prototype?.constructor?.name;
    }
}
