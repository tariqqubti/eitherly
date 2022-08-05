import { Future, tryFuture } from "../src/future";

const goodQuestion = 'The Answer to the Ultimate Question of Life, the Universe, and Everything?'
const badQuestion = 'What is that?'

async function impureAnswer(question: string): Promise<number> {
  if(question === goodQuestion)
    return 42
  throw 'Wrong question'
}

function pureAnswer(question: string): Future<string, number> {
  return tryFuture(() => impureAnswer(question))
    .mapL(err => typeof err === 'string' ? err : 'Unknown error')
}

pureAnswer(goodQuestion)
  .map(console.log) // 42
  .mapL(console.error)
  .run()
pureAnswer(badQuestion)
  .map(console.log)
  .mapL(console.error) // Wrong question
  .run()
