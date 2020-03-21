import { TypeUtils } from '../TypeUtils';

class TypedClass {
    public prop: string = '';
}

const typedClass: TypedClass = new TypedClass();
const simpleObj = {};
const text = '';
const num = 10;
const bool = true;
const fn = (): void => {};

test('wellKownJsTypes method must return 6 primitive types, object and function', () => {
    expect(TypeUtils.getWellKnownJsTypes()).toHaveLength(8);
});

test('getTypeName must return a correct type name', () => {
    expect(TypeUtils.getTypeName(typedClass)).toBe('TypedClass');
    expect(TypeUtils.getTypeName(simpleObj)).toBe('Object');
    expect(TypeUtils.getTypeName(text)).toBe('String');
    expect(TypeUtils.getTypeName(num)).toBe('Number');
    expect(TypeUtils.getTypeName(bool)).toBe('Boolean');
    expect(TypeUtils.getTypeName(fn)).toBe('Function');
    expect(TypeUtils.getTypeName(undefined)).toBe(undefined);
    expect(TypeUtils.getTypeName(null)).toBe(undefined);
});

test('only typed objects can be initializable', () => {
    expect(TypeUtils.isInitializable(typedClass)).toBeTruthy();
    expect(TypeUtils.isInitializable(simpleObj)).toBeFalsy();
    expect(TypeUtils.isInitializable(text)).toBeFalsy();
    expect(TypeUtils.isInitializable(num)).toBeFalsy();
    expect(TypeUtils.isInitializable(bool)).toBeFalsy();
    expect(TypeUtils.isInitializable(fn)).toBeFalsy();
    expect(TypeUtils.isInitializable(undefined)).toBeFalsy();
    expect(TypeUtils.isInitializable(null)).toBeFalsy();
});
