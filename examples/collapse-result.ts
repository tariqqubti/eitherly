import { Err, collapseResult, Ok, Result } from "../src/result"

export function str(value: unknown): Result<string> {
  return typeof value === 'string' ? new Ok(value) : new Err('Must be a string')
}

export function num(value: unknown): Result<number> {
  return typeof value === 'number' ? new Ok(value) : new Err('Must be a string')
}

export function validate(name: unknown, age: unknown) {
  return collapseResult({
    name: str(name),
    age: num(age),
  })
}

console.log(validate('Zaphod', 42)) // Ok { value: { name: 'Zaphod', age: 42 }, kind: 'Ok' }
console.log(validate(true, {foo: 'bar'})) // Err { reason: { name: 'Must be a string', age: 'Must be a string' }, kind: 'Err' }
console.log(validate('Arthur', true)) // Err { reason: { age: 'Must be a string' }, kind: 'Err' }
