const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRouter = require("./app/routers/auth");
const accountRouter = require("./app/routers/account");
const userRouter = require("./app/routers/user");
const transactionRouter = require("./app/routers/transaction");

const app = express();

app.use(
  cors({
    origin: "https://localhost:3000",
    //origin: 'http://localhost:3000',
    //origin: 'http://localhost:3001',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = 8888;
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
