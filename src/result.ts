import { Either, Left, Right } from "./either"

/**
 * Simple type to use as a return value from an impure function
 * Example:
 * ```
 * function findCustomerById(id: string): Promise<Result<Customer | null>>
 * ```
 */
export type Result<T> = Err | Ok<T>

export class Err {
  readonly kind = 'Err'
  constructor(readonly reason: unknown) {}
  isErr(): this is Err {
    return true
  }
}

export class Ok<T> {
  readonly kind = 'Ok'
  constructor(readonly value: T) {}
  isErr(): this is Err {
    return false
  }
}

export function map<A, B>(f: (a: A) => B) {
  return function(result: Result<A>): Result<B> {
    if(result.isErr()) return result
    return new Ok(f(result.value))
  }
}

export function chain<A, B>(f: (a: A) => Result<B>) {
  return function(result: Result<A>): Result<B> {
    if(result.isErr()) return result
    return f(result.value)
  }
}

/**
 * Enclose a call that might throw to get a `Result` instead of try-catch block
 * Example:
 * ```
 * const parsing: Result<any> = tryResult(() => JSON.parse(someString))
 * ```
 */
export function tryResult<T>(f: () => T): Result<T> {
  try {
    return new Ok(f())
  } catch(error) {
    return new Err(error)
  }
}

/**
 * Enclose a call that might throw in the future to get a `Result` instead of try-catch block
 * Example:
 * ```
 * const finding: Result<Customer | null> = await tryAsyncResult(
 *  () => collection.findOneBy(someCustomerId)
 * )
 * ```
 */
export async function tryAsyncResult<T>(f: () => Promise<T>): Promise<Result<T>> {
  try {
    return new Ok(await f())
  } catch(error) {
    return new Err(error)
  }
}

/**
 * Useful for form validation
 * Example:
 * ```
 * const result: Result<Form> = fromResults({
 *  name: validateName(body.name),
 *  age: validateAge(body.age)
 * })
 * if(result.isErr()) return result.reason
 * const form: Form = result.value
 * ```
 */
export function fromResults<T>(
  results: {[P in keyof T]: Result<T[P]>}
): Result<{[P in keyof T]: T[P]}> {
  const reasons: {[P in keyof T]?: unknown} = {}
  const values = {} as {[P in keyof T]: T[P]}
  const keys = Object.keys(results) as (keyof T)[]
  for(const key of keys) {
    const result = results[key]
    if(result.isErr())
      reasons[key] = result.reason
    else
      values[key] = result.value
  }
  if(Object.keys(reasons).length)
    return new Err(reasons)
  return new Ok(values)
}

export function bool(value: unknown): Result<boolean> {
  if(typeof value === 'boolean') return new Ok(value)
  return new Err('Value must be a boolean')
}

export function num(value: unknown): Result<number> {
  if(typeof value === 'number') return new Ok(value)
  return new Err('Value must be a number')
}

export function str(value: unknown): Result<string> {
  if(typeof value === 'string') return new Ok(value)
  return new Err('Value must be a string')
}

export function arr(value: unknown): Result<Array<unknown>> {
  if(Array.isArray(value)) return new Ok(value)
  return new Err('Value must be an array')
}

export function obj(value: unknown): Result<object> {
  if(value !== undefined && value !== null && typeof value === 'object') return new Ok(value)
  return new Err('Value must be an object')
}

export function optional<T>(
  value: unknown,
  f: (t: boolean | number | string | symbol | bigint | object) => Result<T>
): Result<T | null> {
  if(value === undefined || value === null) return new Ok(null)
  return f(value)
}

export function toEither<T>(result: Result<T>): Either<unknown, T> {
  if(result.isErr()) return new Left(result.reason)
  return new Right(result.value)
}
