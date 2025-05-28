
import { db } from "../shared/db";
import {
  users,
  customers,
  brewerySettings,
  categories,
  products,
  tables,
} from "../shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function seed() {
  const adminExists = await db.select().from(users).where(eq(users.username, "admin"));
  if (adminExists.length === 0) {
    await db.insert(users).values([
      {
        username: "admin",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        name: "Administrador",
        email: "admin@admin.com",
        language: "pt",
      },
      {
        username: "gerente01",
        password: await bcrypt.hash("senha123", 10),
        role: "manager",
        name: "Gerente Responsável",
        email: "gerente@empresa.com",
        language: "pt",
      },
      {
        username: "garcom01",
        password: await bcrypt.hash("senha123", 10),
        role: "waiter",
        name: "Garçom 01",
        email: "garcom@empresa.com",
        language: "pt",
      },
    ]);
    console.log("Usuários criados.");
  }

  await db.insert(brewerySettings).values({
    name: "Cervejaria Don Tap",
    logoUrl: "https://example.com/logo.png",
    description: "Bem-vindo à Don Tap — sabores artesanais únicos!",
    language: "pt",
  });

  const insertedCategories = await db.insert(categories).values([
    { name: "Cervejas", description: "Variedades de cervejas artesanais" },
    { name: "Petiscos", description: "Acompanhamentos e porções" },
  ]).returning();

  const cervejasCategory = insertedCategories.find(c => c.name === "Cervejas");
  const petiscosCategory = insertedCategories.find(c => c.name === "Petiscos");

  await db.insert(products).values([
    {
      name: "IPA da Casa",
      description: "Cerveja lupulada e aromática",
      price: 20.0,
      ibu: 60,
      abv: 6.5,
      categoryId: cervejasCategory?.id!,
    },
    {
      name: "Pilsen Tradicional",
      description: "Refrescante e leve",
      price: 15.0,
      ibu: 10,
      abv: 4.7,
      categoryId: cervejasCategory?.id!,
    },
    {
      name: "Batata Frita",
      description: "Porção de batatas crocantes",
      price: 18.0,
      categoryId: petiscosCategory?.id!,
    },
    {
      name: "Bolinho de Bacalhau",
      description: "6 unidades, acompanha limão",
      price: 22.0,
      categoryId: petiscosCategory?.id!,
    }
  ]);

  await db.insert(tables).values([
    { name: "Mesa 1", slug: "mesa_01", number: 1 },
    { name: "Mesa 2", slug: "mesa_02", number: 2 },
    { name: "Mesa 3", slug: "mesa_03", number: 3 },
  ]);

  console.log("Seed completo executado com sucesso.");
}
