import { config } from "dotenv";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import bcrypt from "bcryptjs";

config();

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

    // Seed Questions for Medical History, Family History and Features
    // Using exact question IDs and texts from the pages
    const medicalQuestions = [
      { id: "alcohol", category: "medical", text: "Alcohol intake?", type: "boolean", options: null },
      { id: "tobacco", category: "medical", text: "Tobacco products (Cigarette / bidi / khaini / hookah)?", type: "boolean", options: null },
      { id: "gutka", category: "medical", text: "Gutka (Areca Nut)?", type: "boolean", options: null },
      { id: "paan", category: "medical", text: "Paan with slaked lime, zarda and betel nut?", type: "boolean", options: null },
      { id: "precipitation", category: "medical", text: "Precipitation effect in the mouth due to tobacco or betel leaf?", type: "boolean", options: null },
      { id: "hiv", category: "medical", text: "Have you ever been tested for HIV?", type: "boolean", options: null },
      { id: "hpv", category: "medical", text: "Have you ever been tested for HPV?", type: "boolean", options: null },
    ];

    const familyQuestions = [
      { id: "family_cancer", category: "family", text: "Family history of Head, Neck, Throat or oral cancer in blood relatives", type: "boolean", options: null },
    ];

    async function seedQuestions(list) {
      for (const q of list) {
        const exists = await prisma.question.findFirst({ where: { category: q.category, text: q.text } });
        if (!exists) {
          await prisma.question.create({ data: { category: q.category, text: q.text, type: q.type, options: q.options } });
          console.log(`Created question [${q.id}]:`, q.text);
        } else {
          console.log(`Question already exists, skipping [${q.id}]:`, q.text);
        }
      }
    }

    await seedQuestions(medicalQuestions);
    await seedQuestions(familyQuestions);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
