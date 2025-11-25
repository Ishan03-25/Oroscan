import { PrismaClient } from '../lib/generated/prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('Creating admin user...\n')
  
  const email = 'test@admin.com'
  const password = 'OroscanAdmin'
  const username = 'admin'
  const name = 'Admin User'
  
  // Check if user already exists
  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { username: username }
      ]
    }
  })
  
  if (existing) {
    console.log('User with this email or username already exists!')
    console.log('Updating existing user to ADMIN role...\n')
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        password: hashedPassword,
        role: 'ADMIN',
        email: email
      }
    })
    
    console.log('✓ User updated successfully!')
    console.log(`  Email: ${updated.email}`)
    console.log(`  Username: ${updated.username}`)
    console.log(`  Role: ${updated.role}`)
    console.log(`  Password: OroscanAdmin`)
  } else {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        name: name,
        password: hashedPassword,
        role: 'ADMIN',
        isDoctor: false
      }
    })
    
    console.log('✓ Admin user created successfully!')
    console.log(`  Email: ${user.email}`)
    console.log(`  Username: ${user.username}`)
    console.log(`  Name: ${user.name}`)
    console.log(`  Role: ${user.role}`)
    console.log(`  Password: OroscanAdmin`)
  }
  
  console.log('\nYou can now login with:')
  console.log(`  Email/Username: ${email} or ${username}`)
  console.log(`  Password: OroscanAdmin`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
