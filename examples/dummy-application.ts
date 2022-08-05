import { Future, tryFuture, fromNullable, Maybe } from "../src/index";

// Impure

class Connection<T> {
  constructor(
    readonly name: string,
    readonly records: T[],
    public connected: boolean
  ) {}
}

class Collection<T> {
  constructor(readonly connection: Connection<T>) {}
  async findOne(predicate: (t: T) => boolean): Promise<T | undefined> {
    if(this.connection.connected)
      return this.connection.records.find(predicate)
    throw `${this.connection.name} disconnected`
  }
  async find(predicate: (t: T) => boolean): Promise<T[]> {
    if(this.connection.connected)
      return this.connection.records.filter(predicate)
    throw `${this.connection.name} disconnected`
  }
}

// Pure

type Person = {
  id: number,
  name: string,
  planetId: number,
}

class PersonRepo {
  constructor(
    readonly collection: Collection<Person>,
  ) {}
  findById(id: number): Future<string, Maybe<Person>> {
    return tryFuture(() => this.collection.findOne(user => user.id === id))
      .map(fromNullable)
      .mapL(err => typeof err === 'string' ? err : 'Unknown error')
  }
}

type Planet = {
  id: number,
  name: string,
}

class PlanetRepo {
  constructor(
    readonly collection: Collection<Planet>,
  ) {}
  findById(id: number): Future<string, Maybe<Planet>> {
    return tryFuture(() => this.collection.findOne(planet => planet.id === id))
      .map(fromNullable)
      .mapL(err => typeof err === 'string' ? err : 'Unknown error')
  }
}

class PersonService {
  constructor(
    readonly personRepo: PersonRepo,
    readonly planetRepo: PlanetRepo,
  ) {}
  findPersonsPlanet(personId: number): Future<string, Planet> {
    return this.personRepo.findById(personId)
      .chain(maybe => maybe.toEither('User not found').toFuture()) // Maybe -> Future
      .chain(user => this.planetRepo.findById(user.planetId))
      .chain(maybe => maybe.toEither('Location not found').toFuture()) // Maybe -> Future
  }
  findPersonsPlanetWithPerson(personId: number): Future<string, Person & {planet: Planet}> {
    return this.personRepo.findById(personId)
      .chain(maybe => maybe.toEither('User not found').toFuture()) // Maybe -> Future
      .chain(
        person => this.planetRepo.findById(person.planetId)
          .map(maybe => maybe.map(planet => ({...person, planet})))
      )
      .chain(maybe => maybe.toEither('Location not found').toFuture()) // Maybe -> Future
  }
}

// Handle

const people: Person[] = [
  {id: 42, name: 'Zaphod Beeblebrox', planetId: 100},
  {id: 43, name: 'Ford Prefect', planetId: 100},
  {id: 44, name: 'Trillian', planetId: 101},
  {id: 45, name: 'Arthur Dent', planetId: 101},
]

const planets: Planet[] = [
  {id: 100, name: 'Betelgeuse Five'},
  {id: 101, name: 'Earth'},
]

export async function main() {
  const peopleConnection = new Connection('people', people, true)
  const planetsConnection = new Connection('planets', planets, true)
  const userService = new PersonService(
    new PersonRepo(new Collection(peopleConnection)),
    new PlanetRepo(new Collection(planetsConnection)),
  )
  await userService.findPersonsPlanet(42)
    .map(console.log) // { id: 100, name: 'Betelgeuse Five' }
    .mapL(console.error)
    .run()
  await userService.findPersonsPlanetWithPerson(44)
    .map(console.log) // { id: 44, name: 'Trillian', planetId: 101, planet: { id: 101, name: 'Earth' } }
    .mapL(console.error)
    .run()
  
  // Something went wrong
  planetsConnection.connected = false

  await userService.findPersonsPlanet(42)
    .map(console.log)
    .mapL(console.error) // planets disconnected
    .run()
  await userService.findPersonsPlanetWithPerson(44)
    .map(console.log)
    .mapL(console.error) // planets disconnected
    .run()
}

main()
