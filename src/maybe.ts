import { Either, Left, Right } from "./either"

export type Maybe<T> = None<T> | Some<T>

export interface MaybeContract<T> {
  isNone(): this is None<T>
  isSome(): this is Some<T>
  map<U>(f: (t: T) => U): Maybe<U>
  chain<U>(f: (t: T) => Maybe<U>): Maybe<U>
  someOr(t: T): T
  use<U>(onNone: () => U, onSome: (t: T) => U): U
  toEither<L>(left: L): Either<L, T>
}

export class None<T> implements MaybeContract<T> {
  isNone(): this is None<T> {
    return true
  }
  isSome(): this is Some<T> {
    return false
  }
  map<U>(f: (t: T) => U): Maybe<U> {
    return this as any as None<U>
  }
  chain<U>(f: (t: T) => Maybe<U>): Maybe<U> {
    return this as any as None<U>
  }
  someOr(t: T): T {
    return t
  }
  use<U>(onNone: () => U, onSome: (t: T) => U): U {
    return onNone()
  }
  toEither<L>(left: L): Either<L, T> {
    return new Left(left)
  }
}

export class Some<T> implements MaybeContract<T> {
  constructor(
    readonly value: T,
  ) {}
  isNone(): this is None<T> {
    return false
  }
  isSome(): this is Some<T> {
    return true
  }
  map<U>(f: (t: T) => U): Maybe<U> {
    return new Some(f(this.value))
  }
  chain<U>(f: (t: T) => Maybe<U>): Maybe<U> {
    return f(this.value)
  }
  someOr(t: T): T {
    return this.value
  }
  use<U>(onNone: () => U, onSome: (t: T) => U): U {
    return onSome(this.value)
  }
  toEither<L>(left: L): Either<L, T> {
    return new Right(this.value)
  }
}

export function fromNullable<T>(value: undefined | null | T): Maybe<T> {
  if(value === undefined || value === null)
    return new None
  return new Some(value)
}

export function tryMaybe<T>(f: () => T): Maybe<T> {
  try {
    return new Some(f())
  } catch(error) {
    return new None
  }
}
