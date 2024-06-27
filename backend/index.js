require('dotenv').config(); // Make sure this comes first


const express = require('express')
const app = express()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

app.use(express.json())

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })

  app.get('/', (req, res) => {
    res.send('Welcome to my app!')
  })

  app.get('/test', async (req, res) => {
    const test = await prisma.test.findMany()
    res.json(test)
  })