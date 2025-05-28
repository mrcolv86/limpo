import { db } from "../shared/db";
import { users } from "../shared/schema";
import bcrypt from "bcryptjs";

export async function seed() {
  const existing = await db.select().from(users).where(users.username === "admin");

  if (existing.length === 0) {
    const hashed = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      username: "admin",
      password: hashed,
      role: "admin", // ajuste se houver outro campo obrigatório
    });
    console.log("Usuário admin criado.");
  } else {
    console.log("Usuário admin já existe.");
  }
}
