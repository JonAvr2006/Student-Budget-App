import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  // 1. Get the user record using their email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-06"

  // 2. Query the budget by userId
  const budget = await prisma.budget.findFirst({
    where: {
      userId: user.id,
      month: currentMonth,
    },
  });

  res.json(budget || { amount: 0 });
}
