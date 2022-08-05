import { Left, Right, Either } from "../src/index"

function isNumber(value: unknown): Either<string, number> {
  return typeof value === 'number' ? new Right(value) : new Left('Not a number')
}

function isBetween(min: number, max: number) {
  return function(value: number): Either<string, number> {
    return value >= min && value <= max ? new Right(value) : new Left(`${value} is not between ${min} and ${max}`)
  }
}

function isMyNumber(value: unknown): Either<string, number> {
  return isNumber(value)
    .chain(isBetween(40, 45))
}

console.log(isMyNumber(55)) // Left { left: '55 is not between 40 and 45' }
console.log(isMyNumber(42)) // Right { right: 42 }
