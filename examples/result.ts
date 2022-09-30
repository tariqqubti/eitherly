import { Err, Ok, Result } from "../src"

function isNumber(value: unknown): Result<number> {
  return typeof value === 'number' ? new Ok(value) : new Err('Not a number')
}

function isBetween(min: number, max: number, value: number) {
  return value >= min && value <= max ? new Ok(value) : new Err(`${value} is not between ${min} and ${max}`)
}

function isMyNumber(value: unknown): Result<number> {
  const assertingNumber = isNumber(value)
  if(assertingNumber.isErr()) return assertingNumber
  return isBetween(40, 50, assertingNumber.value)
}

console.log(isMyNumber(55)) // Err { reason: '55 is not between 40 and 45' }
console.log(isMyNumber(42)) // Ok { value: 42 }
