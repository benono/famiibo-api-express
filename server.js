const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
const PORT = 8000
const prisma = new PrismaClient();

// Register user
app.post('/api/auth/register', async (req, res) => {
  console.log('start')
  console.log(req.body)
  const {username, email, password} = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    }
  })
  res.json(user);
});

// login
app.post('/api/auth/login', async (req, res) => {
  const {email, password} = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if (!user) {
    return res
      .status(401)
      .json({error: 'User not found'});
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .status(401)
      .json({error: 'Invalid password'});
  }
  const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY , {expiresIn: '1d'});
  res.json({token});

})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

