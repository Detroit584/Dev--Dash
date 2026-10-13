import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get resume
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update entire resume
router.put('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.resume = req.body;
    await user.save();
    res.json(user.resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add experience
router.post('/experience', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.resume.experience.push(req.body);
    await user.save();
    res.json(user.resume.experience);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add project
router.post('/project', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.resume.projects.push(req.body);
    await user.save();
    res.json(user.resume.projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
