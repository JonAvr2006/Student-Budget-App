import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  const currentMonth = new Date().toISOString().slice(0, 7);

  if (req.method === "GET") {
    const budget = await prisma.budget.findFirst({
      where: { userId: user.id, month: currentMonth },
    });
    return res.json(budget || { amount: 0 });
  }

  if (req.method === "POST") {
    const { month, amount } = req.body;

    const budget = await prisma.budget.upsert({
      where: {
        userId_month: { userId: user.id, month },
      },
      update: { amount },
      create: {
        userId: user.id,
        month,
        amount,
      },
    });

    return res.status(200).json(budget);
  }

  res.status(405).json({ error: "Method not allowed" });
}
