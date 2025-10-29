import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create test user
    const testUserData = {
      email: "test@example.com",
      username: "testuser",
      password: await bcrypt.hash("test123", 10),
      name: "Test User"
    };

    const testUser = await prisma.user.upsert({
      where: { email: testUserData.email },
      update: {},
      create: testUserData,
    });

    console.log("Created test user:", {
      id: testUser.id,
      email: testUser.email,
      username: testUser.username,
    });

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}