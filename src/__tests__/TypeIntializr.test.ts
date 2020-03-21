import { TypeInitialzr, init } from '../index'

class Y {
  public a: number
  public b: number
  public plus(): number {
    return this.a + this.b
  }
}

class X {
  public a: number
  public b: number

  @init(Y) public ipisulom: Y

  public plus(): number {
    return this.a + this.b
  }
}

class Bar {
  public value: string

  @init(X) public x: X

  public getValue(): string | undefined {
    return this.value
  }
}

class Foo {
  public value: string
  public another: string

  @init(X) public x: X
  @init(Bar) public bar: Bar

  public getValue(): string | undefined {
    return this.value
  }
}

test('must be possible to initialize a type with prop values', () => {
  //Act
  const result = TypeInitialzr.init(Foo, { value: 'foo' })

  //Assert
  expect(result.value).not.toBeUndefined()
  expect(result.value).toBe('foo')
  expect(result.getValue).not.toBeUndefined()
  expect(result.getValue()).toBe('foo')
  expect(result.bar).toBeUndefined()
})

test('must be possible to initialize a type with nested types', () => {
  //Act
  const result = TypeInitialzr.init(Foo, { value: 'foo', bar: { value: 'bar' } })

  //Assert
  expect(result.value).not.toBeUndefined()
  expect(result.value).toBe('foo')
  expect(result.getValue).not.toBeUndefined()
  expect(result.getValue()).toBe('foo')
  expect(result.bar).not.toBeUndefined()
  expect(result.bar.getValue).not.toBeUndefined()
  expect(result.bar.getValue()).toBe('bar')
})

test('must be possible to initialize a type with nested types in deep hierarchy', () => {
  //Act
  const result = TypeInitialzr.init(Foo, {
    value: 'foo',
    another: 'another',
    bar: { value: 'bar' },
  })

  //Assert
  expect(result.value).not.toBeUndefined()
  expect(result.value).toBe('foo')
  expect(result.another).not.toBeUndefined()
  expect(result.another).toBe('another')
  expect(result.getValue).not.toBeUndefined()
  expect(result.getValue()).toBe('foo')
  expect(result.bar).not.toBeUndefined()
  expect(result.bar.getValue).not.toBeUndefined()
  expect(result.bar.getValue()).toBe('bar')
})

test('must be possible to initialize a type with nested types having same another type as nested at both parent types', () => {
  //Act
  const result = TypeInitialzr.init(Foo, {
    x: { a: 1, b: 2 },
    bar: { x: { a: 5, b: 6 } },
  })

  //Assert
  expect(result.x).not.toBeUndefined()
  expect(result.x.plus).not.toBeUndefined()
  expect(result.x.plus()).toBe(3)
  expect(result.bar.x).not.toBeUndefined()
  expect(result.bar.x.plus).not.toBeUndefined()
  expect(result.bar.x.plus()).toBe(11)
})

test('must be possible to initialize a type with a much more nested types', () => {
  //Act
  const result = TypeInitialzr.init(Foo, {
    x: { a: 1, b: 2, ipisulom: { a: 8, b: 9 } },
    bar: { x: { a: 5, b: 6, ipisulom: { a: 12, b: 14 } } },
  })

  //Assert
  expect(result.x).not.toBeUndefined()
  expect(result.x.plus).not.toBeUndefined()
  expect(result.x.plus()).toBe(3)
  expect(result.x.ipisulom).not.toBeUndefined()
  expect(result.x.ipisulom.plus).not.toBeUndefined()
  expect(result.x.ipisulom.plus()).toBe(17)
  expect(result.bar.x).not.toBeUndefined()
  expect(result.bar.x.plus).not.toBeUndefined()
  expect(result.bar.x.plus()).toBe(11)
  expect(result.bar.x.ipisulom).not.toBeUndefined()
  expect(result.bar.x.ipisulom.plus).not.toBeUndefined()
  expect(result.bar.x.ipisulom.plus()).toBe(26)
})
