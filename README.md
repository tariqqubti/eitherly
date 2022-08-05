# Type Class

## Overview

Helpful type classes for TypeScript

## Install

```
npm install type-class
```

```typescript
import { tryFuture, Either, Left, Right } from "type-class"

const future = tryFuture(() => Promise.resolve(42))

function isNumber(value: unknown): Either<string, number> {
  return typeof value === 'number' ? new Right(value) : new Left('Not a number')
}

function isBetween(min: number, max: number) {
  return function(value: number): Either<string, number> {
    return value >= min && value <= max ? new Right(value) : new Left(`${value} is not between ${min} and ${max}`)
  }
}

function isMyNumber(value: unknown): Either<string, number> {
  return isNumber(value)
    .chain(isBetween(40, 45))
}
```

## Examples

Maybe [example](examples/maybe.ts)

Either [example](examples/either.ts)

Future [example](examples/future.ts)

Dummy Application [example](examples/dummy-application.ts)
