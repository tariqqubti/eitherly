import { AsyncEither } from "./async-either"
import { asyncTryResult, Err, Ok, Result } from "./result"

export class AsyncResult<T> {
  constructor(
    readonly run: () => Promise<Result<T>>
  ) {}
  static resolve<T>(value: T): AsyncResult<T> {
    return new AsyncResult(async () => new Ok(value))
  }
  static reject<T>(reason: unknown): AsyncResult<T> {
    return new AsyncResult(async () => new Err(reason))
  }
  static fromNullable<T>(reason: unknown) {
    return function(value: T | null | undefined): AsyncResult<T> {
      return new AsyncResult(async () => value ? new Ok(value) : new Err(reason))
    }
  }
  static tryCatch<T>(f: () => Promise<T>): AsyncResult<T> {
    return new AsyncResult(
      () => asyncTryResult(f)
    )
  }
  map<T_>(f: (value: T) => T_): AsyncResult<T_> {
    return new AsyncResult(
      async () => (await this.run()).map(f)
    )
  }
  chain<T_>(f: (value: T) => AsyncResult<T_>): AsyncResult<T_> {
    return new AsyncResult(
      async () => {
        const result = await this.run()
        if(result.isErr())
          return result as any as Result<T_>
        return f(result.value).run()
      }
    )
  }
  mapL(f: (reason: unknown) => unknown): AsyncResult<T> {
    return new AsyncResult(
      async () => (await this.run()).mapL(f)
    )
  }
  chainL(f: (reason: unknown) => AsyncResult<T>): AsyncResult<T> {
    return new AsyncResult(
      async () => {
        const result = await this.run()
        if(result.isOk())
          return result
        return f(result.reason).run()
      }
    )
  }
  get either(): AsyncEither<unknown, T> {
    return new AsyncEither(async () => (await this.run()).either)
  }
}
