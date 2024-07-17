const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const isAuthenticated = require('../../middlewares/isAuthenticated');

const prisma = new PrismaClient();

router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId
    }
  })
  if (!user) {
    return res.status(404).json({message: 'User not found'});
  }
  res.status(200).json({user: {id: user.id, name: user.username, email: user.email, role: user.role, familyId: user.familyId}});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  }
})


module.exports = router;

