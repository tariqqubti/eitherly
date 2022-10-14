import { obj, has, str, len, arr } from "../src/validation"

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
