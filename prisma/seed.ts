import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

import { users } from "./seed-data/users";
import { systemSettings } from "./seed-data/systemSettings";
import { categories } from "./seed-data/categories";
import { products } from "./seed-data/products";
import { expenseCategories } from "./seed-data/expenseCategories";
import { productMixers } from "./seed-data/productMixers";



const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  
  const prisma = new PrismaClient({
    adapter,
  });


async function getCategoryId(categoryName: string) {
  const category = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });

  if (!category) {
    throw new Error(
      `Category "${categoryName}" not found`
    );
  }

  return category.id;
}

async function main() {

  console.log("🌱 Starting seed...");

  // =====================
  // Seed Users
  // =====================

  console.log("👤 Seeding users...");

  for (const user of users) {

    const passwordHash = await bcrypt.hash(user.password, 10);

    const pinHash = await bcrypt.hash(user.pin, 10);

    await prisma.user.upsert({
      where: {
        username: user.username,
      },

      update: {
        displayName: user.displayName,
        role: user.role,
        isActive: true,
      },

      create: {
        username: user.username,
        passwordHash,
        pinHash,
        displayName: user.displayName,
        role: user.role,
        isActive: true,
      },
    });
    
  }
  console.log("✅ Users seeded");

  // =====================
  // Seed System Settings
  // =====================

  console.log("⚙️ Seeding system settings...");

  for (const setting of systemSettings) {

    await prisma.systemSetting.upsert({
      where: {
        key: setting.key,
      },

      update: {
        value: setting.value,
        description: setting.description,
      },

      create: {
        key: setting.key,
        value: setting.value,
        description: setting.description,
      },
    });

  }
  console.log("✅ System settings seeded");

    // =====================
  // Seed Categories
  // =====================

  console.log("📂 Seeding categories...");

  for (const category of categories) {

    await prisma.category.upsert({
      where: {
        name: category.name,
      },

      update: {
        icon: category.icon,
        color: category.color,
        sortOrder: category.sortOrder,
        isActive: true,
      },

      create: {
        name: category.name,
        icon: category.icon,
        color: category.color,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });

  }
  console.log("✅ Categories seeded");

    // =====================
  // Seed Products
  // =====================

  console.log("🍺 Seeding products...");

  for (const product of products) {

    const categoryId = await getCategoryId(
      product.category
    );


    await prisma.product.upsert({

      where: {
        name: product.name,
      },

      update: {
        categoryId,
        normalPrice: product.normalPrice,
        tournamentPrice: product.tournamentPrice,
        allowMixer: product.allowMixer,
        isActive: true,
      },

      create: {
        categoryId,
        name: product.name,
        normalPrice: product.normalPrice,
        tournamentPrice: product.tournamentPrice,
        allowMixer: product.allowMixer,
        isActive: true,
      },

    });

  }

  console.log("✅ Products seeded");

    // =====================
  // Seed Product Mixers
  // =====================

  console.log("🥃 Seeding product mixers...");

  for (const item of productMixers) {

    const product = await prisma.product.findUnique({
      where: {
        name: item.product,
      },
    });

    if (!product) {
      console.log(
        `⚠️ Product not found: ${item.product}`
      );
      continue;
    }


    for (const mixerName of item.mixers) {

      const mixer = await prisma.product.findUnique({
        where: {
          name: mixerName,
        },
      });


      if (!mixer) {
        console.log(
          `⚠️ Mixer not found: ${mixerName}`
        );
        continue;
      }


      await prisma.productMixer.upsert({

        where: {
          productId_mixerProductId: {
            productId: product.id,
            mixerProductId: mixer.id,
          },
        },

        update: {},

        create: {
          productId: product.id,
          mixerProductId: mixer.id,
        },

      });

    }

  }

  console.log("✅ Product mixers seeded");

    // =====================
  // Seed Expense Categories
  // =====================

  console.log("💸 Seeding expense categories...");

  for (const category of expenseCategories) {

    await prisma.expenseCategory.upsert({
      where: {
        name: category.name,
      },

      update: {
        icon: category.icon,
        color: category.color,
        isFavorite: category.isFavorite,
        sortOrder: category.sortOrder,
        isActive: true,
      },

      create: {
        name: category.name,
        icon: category.icon,
        color: category.color,
        isFavorite: category.isFavorite,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });

  }

  console.log("✅ Expense categories seeded");

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });