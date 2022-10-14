import { obj, has } from "../src/validation"

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
