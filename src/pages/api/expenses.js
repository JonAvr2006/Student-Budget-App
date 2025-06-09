import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const start = new Date(`${currentMonth}-01`);
  const end = new Date(`${currentMonth}-31`);

  const expenses = await prisma.expense.findMany({
    where: {
      user: { email: session.user.email },
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { date: "desc" },
  });

  res.json(expenses);
}
