import { PrismaClient } from '../lib/generated/prisma/client'
import * as dotenv from 'dotenv'
import * as readline from 'readline'

dotenv.config()

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('=== Set User as Admin ===\n')
  
  const identifier = await question('Enter username or email: ')
  
  // Find user
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: identifier },
        { email: identifier }
      ]
    }
  })
  
  if (!user) {
    console.log('User not found!')
    rl.close()
    return
  }
  
  console.log(`\nFound user: ${user.name || user.username}`)
  console.log(`Current role: ${user.role}`)
  
  const confirm = await question('\nSet this user as ADMIN? (yes/no): ')
  
  if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    })
    console.log(`\n✓ User ${user.username} is now an ADMIN!`)
  } else {
    console.log('\nCancelled.')
  }
  
  rl.close()
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
