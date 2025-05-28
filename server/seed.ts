import { db } from "../shared/db";
import { users } from "../shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function seed() {
  const existing = await db.select().from(users).where(eq(users.username, "admin"));

  if (existing.length === 0) {
    const hashed = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      username: "admin",
      password: hashed,
      role: "admin",
      name: "Administrador",
      email: "admin@admin.com",
      language: "pt"
    });
    console.log("Usuário admin criado.");
  } else {
    console.log("Usuário admin já existe.");
  }
}
