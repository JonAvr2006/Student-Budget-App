import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, password } = req.body;

  if (!email || !password) return res.status(400).send("Missing email or password");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).send("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, hashedPassword },
  });

  res.status(200).send("User created");
}
