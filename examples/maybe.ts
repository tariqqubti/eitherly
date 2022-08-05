import { Maybe, None, Some } from "../src/maybe";

function isOdd(value: number): Maybe<number> {
  return value % 2 === 0 ? new None : new Some(value)
}

console.log(isOdd(3)) // Some { value: 3 }
console.log(isOdd(4)) // None {}
