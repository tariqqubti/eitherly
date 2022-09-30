import { AsyncEither } from "./async-either"

export type Either<L, R> = Left<L, R> | Right<L, R>

export interface EitherContract<L, R> {
  isLeft(): this is Left<L, R>
  isRight(): this is Right<L, R>
  map<R_>(f: (r: R) => R_): Either<L, R_>
  chain<R_>(f: (r: R) => Either<L, R_>): Either<L, R_>
  mapL<L_>(f: (l: L) => L_): Either<L_, R>
  chainL<L_>(f: (l: L) => Either<L_, R>): Either<L_, R>
  leftOr(or: L): L
  rightOr(or: R): R
  use<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T
  toAsync(): AsyncEither<L, R>
}

export class Left<L, R> implements EitherContract<L, R> {
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
  leftOr(or: L): L {
    return this.left
  }
  rightOr(or: R): R {
    return or
  }
  use<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T {
    return onLeft(this.left)
  }
  toAsync(): AsyncEither<L, R> {
    return new AsyncEither(async () => this)
  }
}

export class Right<L, R> implements EitherContract<L, R> {
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
  leftOr(or: L): L {
    return or
  }
  rightOr(or: R): R {
    return this.right
  }
  use<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T {
    return onRight(this.right)
  }
  toAsync(): AsyncEither<L, R> {
    return new AsyncEither(async () => this)
  }
}

export function tryEither<T>(f: () => T): Either<unknown, T> {
  try {
    return new Right(f())
  } catch(error) {
    return new Left(error)
  }
}

export function fromMapOfEither<E, T>(
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
