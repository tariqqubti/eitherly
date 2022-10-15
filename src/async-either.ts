import { Either, Left, Right } from "./either"

export type AsyncResult<T> = AsyncEither<unknown, T>

export class AsyncEither<L, R> {
  constructor(
    readonly run: () => Promise<Either<L, R>>
  ) {}
  static resolve<L, R>(right: R): AsyncEither<L, R> {
    return new AsyncEither(async () => new Right(right))
  }
  static reject<L, R>(left: L): AsyncEither<L, R> {
    return new AsyncEither(async () => new Left(left))
  }
  static fromNullable<L, R>(left: L) {
    return function(right: R | null | undefined): AsyncEither<L, R> {
      return new AsyncEither(async () => right ? new Right(right) : new Left(left))
    }
  }
  map<R_>(f: (t: R) => R_): AsyncEither<L, R_> {
    return new AsyncEither(
      async () => (await this.run()).map(f)
    )
  }
  chain<R_>(f: (t: R) => AsyncEither<L, R_>): AsyncEither<L, R_> {
    return new AsyncEither(
      async () => {
        const either = await this.run()
        if(either.isLeft())
          return either as any as Either<L, R_>
        return f(either.right).run()
      }
    )
  }
  mapL<L_>(f: (t: L) => L_): AsyncEither<L_, R> {
    return new AsyncEither(
      async () => (await this.run()).mapL(f)
    )
  }
  chainL<L_>(f: (t: L) => AsyncEither<L_, R>): AsyncEither<L_, R> {
    return new AsyncEither(
      async () => {
        const either = await this.run()
        if(either.isRight())
          return either as any as Either<L_, R>
        return f(either.left).run()
      }
    )
  }
}

export function tryAsyncEither<R>(f: () => Promise<R>): AsyncEither<unknown, R> {
  return new AsyncEither(async () => {
    try {
      return new Right(await f())
    } catch(error) {
      return new Left(error)
    }
  })
}
