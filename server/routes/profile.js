import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Update profile
router.put('/', protect, async (req, res) => {
  try {
    const { name, bio, skills, githubUsername, leetcodeUsername, linkedinUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, skills, githubUsername, leetcodeUsername, linkedinUrl },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get public profile by username
router.get('/:githubUsername', async (req, res) => {
  try {
    const user = await User.findOne({ githubUsername: req.params.githubUsername }).select('-password -email');
    if (!user) return res.status(404).json({ message: 'Profile not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
