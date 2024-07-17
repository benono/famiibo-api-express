const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRouter = require('./app/routers/auth');
const accountRouter = require('./app/routers/account');

const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());
const PORT = 8888

app.use('/api/auth', authRouter);
app.use('/api/accounts', accountRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

