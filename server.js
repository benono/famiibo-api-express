const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const app = express();
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
  res.send('<h1>Hello World</h1>');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

