import { Future, tryFuture } from "../src/future";

async function impureAnswer(question: string): Promise<number> {
  if(question === 'The Answer to the Ultimate Question of Life, the Universe, and Everything?')
    return 42
  throw 'Wrong question'
}

function pureAnswer(question: string): Future<string, number> {
  return tryFuture(() => impureAnswer(question))
    .mapL(err => typeof err === 'string' ? err : 'Unknown error')
}

async function main() {
  const q1 = 'The Answer to the Ultimate Question of Life, the Universe, and Everything?'
  const q2 = 'What is that?'
  await pureAnswer(q1)
    .map(answer => console.log(answer)) // 42
    .mapL(err => console.error(err))
    .run()
  await pureAnswer(q2)
    .map(answer => console.log(answer))
    .mapL(err => console.error(err)) // Wrong question
    .run()
}

main()
