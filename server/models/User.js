import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  githubUsername: { type: String, default: '' },
  leetcodeUsername: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [String],
  avatarUrl: { type: String, default: '' },

  // Cached GitHub data
  github: {
    repos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    contributions: { type: Number, default: 0 },
    recentRepos: [{ name: String, description: String, stars: Number, language: String, url: String, updatedAt: Date }],
    commitActivity: [{ week: String, commits: Number }],
    lastSync: Date
  },

  // Cached LeetCode data
  leetcode: {
    totalSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    ranking: { type: Number, default: 0 },
    acceptanceRate: { type: String, default: '0%' },
    streak: { type: Number, default: 0 },
    lastSync: Date
  },

  // Resume sections
  resume: {
    experience: [{
      company: String,
      role: String,
      startDate: String,
      endDate: String,
      description: String,
      current: Boolean
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      gpa: String
    }],
    projects: [{
      title: String,
      description: String,
      techStack: [String],
      githubUrl: String,
      liveUrl: String,
      featured: Boolean
    }],
    certifications: [{ title: String, issuer: String, date: String, url: String }]
  },

  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
