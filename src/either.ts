import { Future } from "./future"

export type Either<L, R> = Left<L, R> | Right<L, R>

export class Left<L, R> {
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
  ap<R_>(f: Either<L, (r: R) => R_>): Either<L, R_> {
    return this as any as Left<L, R_>
  }
  mapL<L_>(f: (l: L) => L_): Either<L_, R> {
    return new Left(f(this.left))
  }
  chainL<L_>(f: (l: L) => Either<L_, R>): Either<L_, R> {
    return f(this.left)
  }
  apL<L_>(f: Either<(l: L) => L_, R>): Either<L_, R> {
    return f.mapL(f_ => f_(this.left))
  }
  leftOr(or: L): L {
    return this.left
  }
  rightOr(or: R): R {
    return or
  }
  use<T>(onLeft: (l: L) => T, onRight: (r: R) => T) {
    return onLeft(this.left)
  }
  toFuture(): Future<L, R> {
    return new Future(async () => this)
  }
}

export class Right<L, R> {
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
  ap<R_>(f: Either<L, (r: R) => R_>): Either<L, R_> {
    return f.map(f_ => f_(this.right))
  }
  mapL<L_>(f: (l: L) => L_): Either<L_, R> {
    return this as any as Right<L_, R>
  }
  chainL<L_>(f: (l: L) => Either<L_, R>): Either<L_, R> {
    return this as any as Right<L_, R>
  }
  apL<L_>(f: Either<(l: L) => L_, R>): Either<L_, R> {
    return this as any as Right<L_, R>
  }
  leftOr(or: L): L {
    return or
  }
  rightOr(or: R): R {
    return this.right
  }
  use<T>(onLeft: (l: L) => T, onRight: (r: R) => T) {
    return onRight(this.right)
  }
  toFuture(): Future<L, R> {
    return new Future(async () => this)
  }
}

export function tryEither<T>(f: () => T): Either<unknown, T> {
  try {
    return new Right(f())
  } catch(error) {
    return new Left(error)
  }
}
