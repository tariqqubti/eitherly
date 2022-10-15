import { obj, has, str, len, arr, test, num, int, between, oneOf, lte, gt } from "../src/validation"

console.log(obj(undefined))
console.log(obj(null))
console.log(obj(true))
console.log(obj(Symbol('foo')))
console.log(obj(42))
console.log(obj(BigInt(42)))
console.log(obj('foo'))
console.log(obj([]))
console.log(obj({}))

console.log(obj('foo').chain(has('bar')))
console.log(obj({}).chain(has('bar')))
console.log(obj({bar: 'hello'}).chain(has('bar')))

console.log(str('foo').chain(len(5, 10)))
console.log(str('foobar').chain(len(5, 10)))
console.log(arr([1, 2, 3]).chain(len(1, 2)))
console.log(arr([1, 2]).chain(len(1, 2)))

console.log(str('foo').chain(test(/[0-9]/)))
console.log(str('foo').chain(test(/foo/)))

console.log(num('foo').chain(between(1, 10)))
console.log(num(33).chain(between(1, 10)))
console.log(num(5).chain(between(1, 10)))

console.log(num('foo').chain(int))
console.log(num(4.2).chain(int))
console.log(num(42).chain(int))

console.log(num(42).chain(lte(30)))
console.log(num(42).chain(lte(30)))
console.log(num(42).chain(lte(50)))

console.log(num(-42).chain(gt(0)))
console.log(num(42).chain(gt(0)))

console.log(str('baz').chain(oneOf(['foo', 'bar'])))
console.log(str('foo').chain(oneOf(['foo', 'bar'] as const)))
