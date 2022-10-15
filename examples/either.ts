import { Left, Right, Either, toEitherOfMap, toEitherOfArray } from "../src/either"
import { has, num, str } from "../src/validation"

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

type User = {id: number, name: string}
type UserValidation = {[P in keyof User]?: string}

function validateOneUser(raw: {}): Either<UserValidation, User> {
  return toEitherOfMap<string, User>({
    id: has('id')(raw).chain(v => num(v.id)),
    name: has('name')(raw).chain(v => str(v.name)),
  })
}

function validateManyUsers(raw: {}[]): Either<UserValidation[], User[]> {
  return toEitherOfArray<UserValidation, User>(raw.map(validateOneUser))
}

export function main() {
  console.log(isMyNumber(55)) // Left { left: '55 is not between 40 and 45' }
  console.log(isMyNumber(42)) // Right { right: 42 }

  console.log(validateManyUsers([{id: '42', name: 'zaphod'}, {id: '43'}]))
  console.log(validateManyUsers([{id: 42, name: 'zaphod'}, {id: 43, name: 'arthur'}]))
}

main()
