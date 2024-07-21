const { PrismaClient, AccountType } = require("@prisma/client");
require("dotenv").config();
const isAuthenticated = require("../../middlewares/isAuthenticated");
const { TransactionType } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();

// Update Transaction
router.put("/:id", isAuthenticated, async (req, res) => {
  const {
    id,
    amount,
    date,
    type,
    accountId,
    categoryId,
    payeeId,
    currencyId,
    description,
  } = req.body;

  if (
    !id ||
    !amount ||
    !accountId ||
    !categoryId ||
    !date ||
    !type ||
    !currencyId
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!Object.values(TransactionType).includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        date: new Date(date),
        type,
        accountId,
        categoryId,
        payeeId,
        currencyId,
        description,
      },
    });
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create Transaction
router.post("/", isAuthenticated, async (req, res) => {
  const {
    amount,
    date,
    type,
    accountId,
    categoryId,
    payeeId,
    currencyId,
    description,
  } = req.body;

  if (!amount || !accountId || !categoryId || !date || !type || !currencyId) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!Object.values(TransactionType).includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        date: new Date(date),
        accountId,
        categoryId,
        payeeId,
        currencyId,
        description,
        type,
        familyId: req.familyId,
        userId: req.userId,
      },
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get transactions by date, month, or range
router.get("/", isAuthenticated, async (req, res) => {
  const { date, month, startDate, endDate } = req.query;
  let where = { familyId: req.familyId };

  if (date) {
    where.date = new Date(date);
  } else if (month) {
    const parsedMonth = parseISO(month);
    where.date = {
      gte: startOfMonth(parsedMonth),
      lte: endOfMonth(parsedMonth),
    };
  } else if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  try {
    console.log("Query Parameters:", req.query);
    console.log("Where Clause:", where);
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: true,
        category: true,
        payee: true,
        currency: true,
      },
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get transaction dates within a range
router.get("/dates/:month", isAuthenticated, async (req, res) => {
  const { month } = req.params;

  if (!month) {
    return res.status(400).json({ message: "month is required" });
  }
  const startDate = new Date(month);
  const endDate = new Date(month);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const dates = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
      },
      distinct: ["date"],
    });
    res.status(200).json(dates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
