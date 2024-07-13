const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = require('express').Router();
const prisma = new PrismaClient();


// 新規家族作成とユーザー登録
router.post('/register/new-family', async (req, res) => {
  const { familyName, userName, email, password } = req.body;
  console.log(req.body)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // トランザクションを使用して家族とユーザーを同時に作成
  const result = await prisma.$transaction(async (prisma) => {
    const family = await prisma.family.create({ data: { name: familyName } });
    const user = await prisma.user.create({
      data: {
        name: userName,
        email,
        password: hashedPassword,
        familyId: family.id,
        role: 'ADMIN'
      }
    });
    return { family, user };
  });
  // レスポンス
  res.json(result);
});

// 招待ユーザーの登録
router.post('/register/invited', async (req, res) => {
  const { inviteCode, userName, email, password } = req.body;
  // inviteCodeの検証
  const invite = await prisma.invite.findUnique({ where: { code: inviteCode } });
  if (!invite || invite.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired invite code' });
  }
  // ユーザー作成
  const user = await prisma.user.create({
    data: {
      name: userName,
      email,
      password: hashedPassword,
      familyId: invite.familyId,
      role: 'MEMBER'
    }
  });
  // 招待コードを使用済みにする
  await prisma.invite.update({
    where: { id: invite.id },
    data: { used: true }
  });
  // レスポンス
});

// login
router.post('/login', async (req, res) => {
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


module.exports = router;

