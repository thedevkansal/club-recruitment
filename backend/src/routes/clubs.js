const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  createClub,
  getAllClubs,
  getClub,
  updateClub,
  getUserClubs
} = require('../controllers/clubController');

const router = express.Router();

// Public routes
router.get('/', getAllClubs);
router.get('/:id', getClub);

// Protected routes
router.post('/', authenticate, createClub);
router.put('/:id', authenticate, updateClub);
router.get('/user/managed', authenticate, getUserClubs);

module.exports = router;
