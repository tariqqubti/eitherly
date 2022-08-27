import { everyRight, Left, Result, Right } from "../src/either"

export function str(value: unknown): Result<string> {
  return typeof value === 'string' ? new Right(value) : new Left('Must be a string')
}

export function num(value: unknown): Result<number> {
  return typeof value === 'number' ? new Right(value) : new Left('Must be a string')
}

export function validate(name: unknown, age: unknown) {
  return everyRight({
    name: str(name),
    age: num(age),
  })
}

console.log(validate('Zaphod', 42)) // Right { right: { name: 'Zaphod', age: 42 } }
console.log(validate(true, {foo: 'bar'})) // Left { left: { name: 'Must be a string', age: 'Must be a string' } }
console.log(validate('Arthur', true)) // Left { left: { age: 'Must be a string' } }
