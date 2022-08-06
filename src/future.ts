import { Either, Left, Right } from "./either"

export class Future<L, R> {
  constructor(
    readonly run: () => Promise<Either<L, R>>
  ) {}
  static resolve<L, R>(right: R): Future<L, R> {
    return new Future(async () => new Right(right))
  }
  static reject<L, R>(left: L): Future<L, R> {
    return new Future(async () => new Left(left))
  }
  static fromNullable<L, R>(left: L) {
    return function(right: R | null | undefined): Future<L, R> {
      return new Future(async () => right ? new Right(right) : new Left(left))
    }
  }
  map<R_>(f: (t: R) => R_): Future<L, R_> {
    return new Future(
      async () => (await this.run()).map(f)
    )
  }
  chain<R_>(f: (t: R) => Future<L, R_>): Future<L, R_> {
    return new Future(
      async () => {
        const either = await this.run()
        if(either.isLeft())
          return either as any as Either<L, R_>
        return f(either.right).run()
      }
    )
  }
  ap<R_>(f: Future<L, (r: R) => R_>): Future<L, R_> {
    return new Future(
      async () => {
        const either = await this.run()
        if(either.isLeft())
          return either as any as Either<L, R_>
        return f.map(f_ => f_(either.right)).run()
      }
    )
  }
  mapL<L_>(f: (t: L) => L_): Future<L_, R> {
    return new Future(
      async () => (await this.run()).mapL(f)
    )
  }
  chainL<L_>(f: (t: L) => Future<L_, R>): Future<L_, R> {
    return new Future(
      async () => {
        const either = await this.run()
        if(either.isRight())
          return either as any as Either<L_, R>
        return f(either.left).run()
      }
    )
  }
  apL<L_>(f: Future<(l: L) => L_, R>): Future<L_, R> {
    return new Future(
      async () => {
        const either = await this.run()
        if(either.isRight())
          return either as any as Either<L_, R>
        return f.mapL(f_ => f_(either.left)).run()
      }
    )
  }
}

export function tryFuture<R>(f: () => Promise<R>): Future<unknown, R> {
  return new Future(async () => {
    try {
      return new Right(await f())
    } catch(error) {
      return new Left(error)
    }
  })
}
