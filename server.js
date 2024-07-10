const express = require('express');
require('dotenv').config();
const authRouter = require('./app/routers/auth');

const app = express();
app.use(express.json());
const PORT = 8000

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

