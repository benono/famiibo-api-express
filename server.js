const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRouter = require('./app/routers/auth');

const app = express();

app.use(cors());
app.use(express.json());
const PORT = 8888

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

