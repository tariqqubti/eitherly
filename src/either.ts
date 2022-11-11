import { AsyncEither } from "./async-either"

export type Either<L, R> = Left<L, R> | Right<L, R>

export type Err<T> = Left<unknown, T>
export type Ok<T> = Right<unknown, T>
export type Result<T> = Either<unknown, T>

export interface EitherContract<L, R> {
  isLeft(): this is Left<L, R>
  isRight(): this is Right<L, R>
  map<R_>(f: (r: R) => R_): Either<L, R_>
  chain<R_>(f: (r: R) => Either<L, R_>): Either<L, R_>
  mapL<L_>(f: (l: L) => L_): Either<L_, R>
  chainL<L_>(f: (l: L) => Either<L_, R>): Either<L_, R>
  leftOrNull: L | null
  rightOrNull: R | null
  leftOr(or: L): L
  rightOr(or: R): R
  leftOrThrow: L
  rightOrThrow: R
  use<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T
  toAsync(): AsyncEither<L, R>

  isErr(): this is Err<R>
  isOk(): this is Ok<R>
  errOrNull: L | null
  okOrNull: R | null
  errOr(or: L): L
  okOr(or: R): R
  errOrThrow: L
  okOrThrow: R
}

export class Left<L, R> implements EitherContract<L, R> {
  readonly kind1 = 'Left'
  readonly kind2 = 'Err'
  constructor(
    readonly left: L,
  ) {}
  isLeft(): this is Left<L, R> {
    return true
  }
  isRight(): this is Right<L, R> {
    return false
  }
  map<R_>(f: (r: R) => R_): Either<L, R_> {
    return this as any as Left<L, R_>
  }
  chain<R_>(f: (r: R) => Either<L, R_>): Either<L, R_> {
    return this as any as Left<L, R_>
  }
  mapL<L_>(f: (l: L) => L_): Either<L_, R> {
    return new Left(f(this.left))
  }
  chainL<L_>(f: (l: L) => Either<L_, R>): Either<L_, R> {
    return f(this.left)
  }
  get leftOrNull(): L | null {
    return this.left
  }
  get rightOrNull(): R | null {
    return null
  }
  leftOr(or: L): L {
    return this.left
  }
  rightOr(or: R): R {
    return or
  }
  get leftOrThrow(): L {
    return this.left
  }
  get rightOrThrow(): R {
    throw this.left
  }
  use<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T {
    return onLeft(this.left)
  }
  toAsync(): AsyncEither<L, R> {
    return new AsyncEither(async () => this)
  }

  get reason() {
    return this.left
  }
  isErr(): this is Err<R> {
    return true
  }
  isOk(): this is Ok<R> {
    return false
  }
  get errOrNull(): L | null {
    return this.left
  }
  get okOrNull(): R | null {
    return null
  }
  errOr(or: L): L {
    return this.left
  }
  okOr(or: R): R {
    return or
  }
  get errOrThrow(): L {
    return this.left
  }
  get okOrThrow(): R {
    throw this.left
  }
}

export class Right<L, R> implements EitherContract<L, R> {
  readonly kind1 = 'Right'
  readonly kind2 = 'Ok'
  constructor(
    readonly right: R,
  ) {}
  isLeft(): this is Left<L, R> {
    return false
  }
  isRight(): this is Right<L, R> {
    return true
  }
  map<R_>(f: (r: R) => R_): Either<L, R_> {
    return new Right(f(this.right))
  }
  chain<R_>(f: (r: R) => Either<L, R_>): Either<L, R_> {
    return f(this.right)
  }
  mapL<L_>(f: (l: L) => L_): Either<L_, R> {
    return this as any as Right<L_, R>
  }
  chainL<L_>(f: (l: L) => Either<L_, R>): Either<L_, R> {
    return this as any as Right<L_, R>
  }
  get leftOrNull(): L | null {
    return null
  }
  get rightOrNull(): R | null {
    return this.right
  }
  leftOr(or: L): L {
    return or
  }
  rightOr(or: R): R {
    return this.right
  }
  get leftOrThrow(): L {
    throw this.right
  }
  get rightOrThrow(): R {
    return this.right
  }
  use<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T {
    return onRight(this.right)
  }
  toAsync(): AsyncEither<L, R> {
    return new AsyncEither(async () => this)
  }

  get value() {
    return this.right
  }
  isErr(): this is Err<R> {
    return false
  }
  isOk(): this is Ok<R> {
    return true
  }
  get errOrNull(): L | null {
    return null
  }
  get okOrNull(): R | null {
    return this.right
  }
  errOr(or: L): L {
    return or
  }
  okOr(or: R): R {
    return this.right
  }
  get errOrThrow(): L {
    throw this.right
  }
  get okOrThrow(): R {
    return this.right
  }
}

export function tryResult<T>(f: () => T): Result<T> {
  try {
    return ok(f())
  } catch(error) {
    return err(error)
  }
}

export async function tryResultPromise<T>(f: () => Promise<T>): Promise<Result<T>> {
  try {
    return ok(await f())
  } catch(error) {
    return err(error)
  }
}

/**
 * Converts a map of either to an either of map
 * ```
 * {foo: new Left('foo'), bar: new Right}
 * ```
 */
export function toEitherOfMap<E, T>(
  mapOfEither: {[P in keyof T]: Either<E, T[P]>}
): Either<{[P in keyof T]?: E}, {[P in keyof T]: T[P]}> {
  const lefts: {[P in keyof T]?: E} = {}
  const rights = {} as {[P in keyof T]: T[P]}
  const keys = Object.keys(mapOfEither) as (keyof T)[]
  for(const key of keys) {
    const either = mapOfEither[key]
    if(either.isLeft())
      lefts[key] = either.left
    else
      rights[key] = either.right
  }
  if(Object.keys(lefts).length)
    return new Left(lefts)
  return new Right(rights)
}

export function toEitherOfArray<E, T>(
  arrayOfEither: Either<E, T>[],
): Either<E[], T[]> {
  const left: E[] = []
  const right: T[] = []
  for(const either of arrayOfEither) {
    if(either.isLeft()) left.push(either.left)
    else right.push(either.right)
  }
  if(left.length) return new Left(left)
  return new Right(right)
}

export function err<T>(reason: unknown): Err<T> {
  return new Left(reason)
}

export function ok<T>(value: T): Ok<T> {
  return new Right(value)
}
