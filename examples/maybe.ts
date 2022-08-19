import { fromNullable, Maybe } from "../src/index";

function elementAt<T>(index: number) {
  return function(array: T[]): Maybe<T> {
    return fromNullable(array[index])
  }
}

console.log(elementAt(2)([1, 2, 3])) // Some { value: 3 }
console.log(elementAt(42)([1, 2, 3])) // None {}
