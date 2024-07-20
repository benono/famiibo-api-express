const { PrismaClient, AccountType } = require("@prisma/client");
require("dotenv").config();
const isAuthenticated = require("../../middlewares/isAuthenticated");

const router = require("express").Router();
const prisma = new PrismaClient();

// Create Category
router.post("/", isAuthenticated, async (req, res) => {
  // FIXME: balance could be in the body
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: "Name and type are required" });
  }
  if (!Object.values(AccountType).includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  try {
    const account = await prisma.account.create({
      data: {
        name,
        type,
        balance: 0,
        familyId: req.familyId,
        createdById: req.userId,
      },
      include: {
        createdBy: true,
      },
    });
    res.status(201).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Categories
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        familyId: req.familyId,
      },
      select: {
        id: true,
        order: true,
        name: true,
      },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
