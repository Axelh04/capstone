const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


//Save audio recording to DB 
router.post("/users/:id/audios/create", async (req, res) => {
  const { id } = req.params;
  const { audios } = req.body;

  try {
    const newRec = await prisma.recordings.create({
      data: {
        audios,
        userId: parseInt(id)
      },
    });
    res.status(201).json(newRec);
  } catch (error) {
    console.error("Failed to save audio:", error);
    res.status(500).json({ error: "Failed to save audio" });
  }
});

//Get all audios associated with current user
router.get("/users/:id/audios", async (req, res) => {
  const { id } = req.params;
  try {
    const audios = await prisma.recordings.findMany({
      where: { userId: parseInt(id) },
    });
    res.status(200).json(audios);
  } catch (error) {
    console.error("Failed to retrieve audios:", error);
    res.status(500).json({ error: "Failed to retrieve audios" });
  }
});

router.delete("/users/:id/audios/:audioid/delete", async (req, res) => {
  const { id, audioid } = req.params;
  try {
    const deletedAudio = await prisma.recordings.delete({
      where: { id: parseInt(audioid), userId: parseInt(id) },
    });
    res.status(200).json(deletedAudio);
  } catch (error) {
    console.error("Failed to delete Audio:", error);
    res.status(500).json({ error: "Failed to delete Audio" });
  }
});

module.exports = router;
