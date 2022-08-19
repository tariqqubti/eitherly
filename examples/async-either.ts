import { AsyncResult, tryAsyncResult } from "../src/index";

const goodQuestion = 'The Answer to the Ultimate Question of Life, the Universe, and Everything?'
const badQuestion = 'What is that?'

async function impureAnswer(question: string): Promise<number> {
  if(question === goodQuestion)
    return 42
  throw 'Wrong question'
}

function pureAnswer(question: string): AsyncResult<number> {
  return tryAsyncResult(() => impureAnswer(question))
}

pureAnswer(goodQuestion)
  .map(console.log) // 42
  .mapL(console.error)
  .run()
pureAnswer(badQuestion)
  .map(console.log)
  .mapL(console.error) // Wrong question
  .run()
