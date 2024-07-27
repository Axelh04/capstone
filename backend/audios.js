const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//Save audio recording to DB
router.post("/users/:id/audios/create", async (req, res) => {
  const { id } = req.params;
  const { audios } = req.body;

  if (!audios) {
    return res.status(400).json({ error: "Audios data is required." });
  }

  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  try {
    const newRec = await prisma.recordings.create({
      data: {
        audios,
        userId: userId,
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
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  try {
    const audios = await prisma.recordings.findMany({
      where: { userId: userId },
    });
    res.status(200).json(audios);
  } catch (error) {
    console.error("Failed to retrieve audios:", error);
    res.status(500).json({ error: "Failed to retrieve audios" });
  }
});

//Delete audio from user database
router.delete("/users/:id/audios/:audioid/delete", async (req, res) => {
  const { id, audioid } = req.params;
  const userId = parseInt(id, 10);
  const audioId = parseInt(audioid, 10);

  if (isNaN(userId) || isNaN(audioId)) {
    return res.status(400).json({ error: "Invalid IDs provided." });
  }

  try {
    const deletedAudio = await prisma.recordings.delete({
      where: { id: audioId, userId: userId },
    });
    res.status(200).json(deletedAudio);
  } catch (error) {
    console.error("Failed to delete audio:", error);
    if (error.code === "P2025") {
      // Prisma error code for record not found
      res.status(404).json({ error: "Audio not found." });
    } else {
      res.status(500).json({ error: "Failed to delete audio" });
    }
  }
});

module.exports = router;
