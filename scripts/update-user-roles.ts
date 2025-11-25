import { PrismaClient } from '../lib/generated/prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('Updating user roles...')
  
  // Update all existing users to have appropriate roles
  // You can modify this based on your requirements
  
  const users = await prisma.user.findMany()
  
  console.log(`Found ${users.length} users`)
  
  for (const user of users) {
    // Set role based on existing isDoctor field or other criteria
    let role: 'ADMIN' | 'DOCTOR' | 'HEALTH_ASSISTANT' = 'HEALTH_ASSISTANT'
    
    if (user.isDoctor) {
      role = 'DOCTOR'
    }
    
    // You can manually set admin users here by checking username or email
    // Example: if (user.email === 'admin@oroscan.com') role = 'ADMIN'
    
    await prisma.user.update({
      where: { id: user.id },
      data: { role }
    })
    
    console.log(`Updated user ${user.username} to role: ${role}`)
  }
  
  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
