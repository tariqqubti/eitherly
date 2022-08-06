import { Maybe, Some } from "../src/maybe";

function foo(): Maybe<string> {
  return new Some('foo')
}
function bar(): Maybe<number> {
  return new Some(42)
}
function baz(s: string) {
  return function(n: number) {
    return `${s} = ${n}`
  }
}
