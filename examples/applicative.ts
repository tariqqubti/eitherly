import { Maybe, None, Some } from "../src/index";

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
function baz2({s, n}: {s: string, n: number}): string {
    return `${s} = ${n}`
}
const fooBarBaz1 = bar().ap(foo().map(baz))
// Hmmm!!!
const fooBarBaz2 = foo().chain(s => bar().map(n => baz2({s, n})))

// Hmmm!!!
type User = {id: number, name: string, addressId: number}
type Address = {id: number, street: string, building: string}

function getUser(id: number): Maybe<User> {
  return new None
}
function getAddress(id: number): Maybe<Address> {
  return new None
}
function card(user: User, address: Address) {
  return `${user.name} lives in ${address.street}, ${address.building}`
}
const userCard1 = getUser(42)
  .chain(user => getAddress(user.addressId).map(address => ({user, address})))
  .map(({user, address}) => card(user, address))
function card2({user, address}: {user: User, address: Address}) {
  return `${user.name} lives in ${address.street}, ${address.building}`
}
const userCard2 = getUser(42)
  .chain(user => getAddress(user.addressId).map(address => card2({user, address})))