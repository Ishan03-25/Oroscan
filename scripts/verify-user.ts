const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    // Find the test user
    const user = await prisma.user.findFirst({
      where: {
        email: "test@example.com"
      }
    });

    if (!user) {
      console.log("Test user not found in database!");
      return;
    }

    console.log("Found user:", {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name
    });

    // Test password verification
    const testPassword = "test123";
    const isPasswordValid = await bcrypt.compare(testPassword, user.password);
    console.log("\nPassword verification result:", {
      providedPassword: testPassword,
      isValid: isPasswordValid
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();