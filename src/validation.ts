import { Either, Right, Left } from "./either"

export function bool(value: unknown): Either<string, boolean> {
  return typeof value === 'boolean'
    ? new Right(value)
    : new Left(`Value must be a boolean`)
}

export function num(value: unknown): Either<string, number> {
  return typeof value === 'number'
    ? new Right(value)
    : new Left(`Value must be a number`)
}

export function str(value: unknown): Either<string, string> {
  return typeof value === 'string'
    ? new Right(value)
    : new Left(`Value must be a string`)
}

/**
 * ```
 * obj(undefined) // Left
 * obj(null) // Left
 * obj(true) // Left
 * obj(42) // Left
 * obj('foo') // Left
 * obj([]) // Right
 * obj({}) // Right
 * ```
 */
export function obj(value: unknown): Either<string, object> {
  return value !== undefined && value !== null && typeof value === 'object'
    ? new Right(value)
    : new Left(`Value must be an object`)
}

export function arr(value: unknown): Either<string, unknown[]> {
  return Array.isArray(value)
    ? new Right(value)
    : new Left(`Value must be an array`)
}

export function hasOwnProperty<T extends {}, K extends PropertyKey>(value: T, key: K): value is T & Record<K, unknown> {
  return value.hasOwnProperty(key)
}

/**
 * 
 * ```
 * obj('foo').chain(has('bar')) // Left
 * obj({}).chain(has('bar')) // Left
 * obj({bar: 'bar'}).chain(has('bar')) // Right
 * ```
 */
export function has<T extends {}, K extends PropertyKey>(key: K) {
  return function(value: T): Either<string, T & Record<K, unknown>> {
    return hasOwnProperty(value, key)
      ? new Right(value)
      : new Left(`Key '${String(key)}' is missing from object`)
  }
}

export function optional<T>(
  value: unknown,
  f: (t: {}) => Either<unknown, T>
): Either<unknown, T | null> {
  if(value === undefined || value === null) return new Right(null)
  return f(value)
}

export function len<T extends {length: number}>(min: number, max: number) {
  return function(value: T): Either<string, T> {
    return value.length >= min && value.length <= max
      ? new Right(value)
      : new Left(`Value length must be between ${min} and ${max}`)
  }
}

export function test(pattern: RegExp) {
  return function(value: string): Either<string, string> {
    return pattern.test(value)
      ? new Right(value)
      : new Left(`Value did not pass ${pattern} test`)
  }
}

/**
 * any: disable
 * unknown: all
 * {}: all except undefined and null
 * object: [] and {}
 * Record<string, any>: [] and {}
 * Record<string, unknown>: only {}
 * 
 * const test1: any[]                     = [undefined, null, true, Symbol('foo'), 42, BigInt(42), 'foo', ['foo'], {}, {foo: 'foo'}]
 * const test2: unknown[]                 = [undefined, null, true, Symbol('foo'), 42, BigInt(42), 'foo', ['foo'], {}, {foo: 'foo'}]
 * const test3: {}[]                      = [undefined, null, true, Symbol('foo'), 42, BigInt(42), 'foo', ['foo'], {}, {foo: 'foo'}]
 * const test4: object[]                  = [undefined, null, true, Symbol('foo'), 42, BigInt(42), 'foo', ['foo'], {}, {foo: 'foo'}]
 * const test5: Record<string, any>[]     = [undefined, null, true, Symbol('foo'), 42, BigInt(42), 'foo', ['foo'], {}, {foo: 'foo'}]
 * const test6: Record<string, unknown>[] = [undefined, null, true, Symbol('foo'), 42, BigInt(42), 'foo', ['foo'], {}, {foo: 'foo'}]
 */
