import { hash } from 'bcryptjs'
import { createInterface } from 'readline'

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function main() {
  const password = await prompt('Contraseña admin a hashear: ')
  const hashed = await hash(password, 12)
  console.log('\nADMIN_PASSWORD_HASH=' + hashed)
  console.log('\nCopia esta línea en tu .env.local')
}

main()
