import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { category, amount, note, date } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const newExpense = await prisma.expense.create({
      data: {
        userId: user.id,
        category,
        amount: parseFloat(amount),
        note,
        date: new Date(date),
      },
    });

    return res.status(200).json(newExpense);
  }

  if (req.method === "GET") {
    const expenses = await prisma.expense.findMany({
      where: {
        user: { email: session.user.email },
      },
      orderBy: { date: "desc" }, // newest first
    });

    return res.status(200).json(expenses);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
// This API route handles both fetching and creating expenses for the authenticated user.
// It uses NextAuth for authentication and Prisma to interact with the database.