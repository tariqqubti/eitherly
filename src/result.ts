import { AsyncResult } from "./async-result"
import { Either, Left, Right } from "./either"

/** Same as `Either` but `Left` is called `Err` and it is always of type `unknown` */
export type Result<T> = Err<T> | Ok<T>

export interface ResultContract<T> {
  isErr(): this is Err<T>
  isOk(): this is Ok<T>
  map<T_>(f: (value: T) => T_): Result<T_>
  chain<T_>(f: (value: T) => Result<T_>): Result<T_>
  mapL(f: (reason: unknown) => unknown): Result<T>
  chainL(f: (reason: unknown) => Result<T>): Result<T>
  isErr(): this is Err<T>
  isOk(): this is Ok<T>
  errOrNull: unknown | null
  okOrNull: T | null
  errOr(or: unknown): unknown
  okOr(or: T): T
  errOrThrow: unknown
  okOrThrow: T
  use(onErr: (reason: unknown) => T, onOk: (value: T) => T): T
  toAsync(): AsyncResult<T>
  either: Either<unknown, T>
}

export class Err<T> implements ResultContract<T> {
  readonly kind = 'Err'
  constructor(readonly reason: unknown) {}
  isErr(): this is Err<T> {
    return true
  }
  isOk(): this is Ok<T> {
    return false
  }
  map<T_>(f: (value: T) => T_): Result<T_> {
    return this as any as Err<T_>
  }
  chain<T_>(f: (value: T) => Result<T_>): Result<T_> {
    return this as any as Err<T_>
  }
  mapL(f: (reason: unknown) => unknown): Result<T> {
    return new Err(f(this.reason))
  }
  chainL(f: (reason: unknown) => Result<T>): Result<T> {
    return f(this.reason)
  }
  get errOrNull(): unknown | null {
    return this.reason
  }
  get okOrNull(): T | null {
    return null
  }
  errOr(or: unknown): unknown {
    return this.reason
  }
  okOr(or: T): T {
    return or
  }
  get errOrThrow(): unknown {
    return this.reason
  }
  get okOrThrow(): T {
    throw this.reason
  }
  use(onErr: (reason: unknown) => T, onOk: (value: T) => T): T {
    return onErr(this.reason)
  }
  toAsync(): AsyncResult<T> {
    return new AsyncResult(async () => this)
  }
  get either(): Either<unknown, T> {
    return new Left(this.reason)
  }
}

export class Ok<T> implements ResultContract<T> {
  readonly kind = 'Ok'
  constructor(readonly value: T) {}
  isErr(): this is Err<T> {
    return false
  }
  isOk(): this is Ok<T> {
    return true
  }
  map<T_>(f: (value: T) => T_): Result<T_> {
    return new Ok(f(this.value))
  }
  chain<T_>(f: (value: T) => Result<T_>): Result<T_> {
    return f(this.value)
  }
  mapL(f: (reason: unknown) => unknown): Result<T> {
    return this
  }
  chainL(f: (reason: unknown) => Result<T>): Result<T> {
    return this
  }
  get errOrNull(): unknown | null {
    return null
  }
  get okOrNull(): T | null {
    return this.value
  }
  errOr(or: unknown): unknown {
    return or
  }
  okOr(or: T): T {
    return this.value
  }
  get errOrThrow(): unknown {
    throw this.value
  }
  get okOrThrow(): T {
    return this.value
  }
  use(onErr: (reason: unknown) => T, onOk: (value: T) => T): T {
    return onOk(this.value)
  }
  toAsync(): AsyncResult<T> {
    return new AsyncResult(async () => this)
  }
  get either(): Either<unknown, T> {
    return new Right(this.value)
  }
}

export function tryResult<T>(f: () => T): Result<T> {
  try {
    return new Ok(f())
  } catch(error) {
    return new Err(error)
  }
}

export async function asyncTryResult<T>(f: () => Promise<T>): Promise<Result<T>> {
  try {
    return new Ok(await f())
  } catch(error) {
    return new Err(error)
  }
}
