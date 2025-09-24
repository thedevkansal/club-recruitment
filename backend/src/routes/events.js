const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  createEvent,
  getEvents,
  getEventById,
} = require("../controllers/eventController");

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);
// router.get('/club/:clubId', getEventsByClub); // Uncomment if you implement getEventsByClub

// Protected routes
router.post("/", authenticate, createEvent);

module.exports = router;
