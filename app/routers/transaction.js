const { PrismaClient, AccountType } = require("@prisma/client");
require("dotenv").config();
const isAuthenticated = require("../../middlewares/isAuthenticated");
const { TransactionType } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();

// Update Transaction
router.put("/:id", isAuthenticated, async (req, res) => {
  const { amount, accountId, categoryId, payeeId, description } = req.body;
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

module.exports = router;
