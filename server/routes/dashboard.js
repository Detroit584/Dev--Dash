import express from 'express';
import axios from 'axios';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Fetch GitHub data — uses public API (no token required for public profiles)
async function fetchGitHub(username) {
  if (!username) return null;
  try {
    // Build headers — only add Authorization if a valid token is set
    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'DevDash-App'
    };
    const token = process.env.GITHUB_TOKEN;
    if (token && token.trim() && token !== 'your_github_personal_access_token') {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    console.log(`🐙 Fetching GitHub for: ${username}`);

    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers })
    ]);

    const repos = reposRes.data;
    const stars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
    const recentRepos = repos.slice(0, 6).map(r => ({
      name: r.name,
      description: r.description || '',
      stars: r.stargazers_count,
      language: r.language || 'Unknown',
      url: r.html_url,
      updatedAt: r.updated_at
    }));

    // Build simple commit activity from repos (last 12 repos by update date)
    const commitActivity = repos.slice(0, 12).map((r, i) => ({
      week: `Repo${i + 1}`,
      commits: r.stargazers_count + r.forks_count + 1
    }));

    console.log(`✅ GitHub fetched: ${userRes.data.public_repos} repos, ${stars} stars`);

    return {
      repos: userRes.data.public_repos,
      followers: userRes.data.followers,
      following: userRes.data.following,
      avatarUrl: userRes.data.avatar_url,
      stars,
      recentRepos,
      commitActivity,
      lastSync: new Date()
    };
  } catch (err) {
    console.error('GitHub fetch error:', err.response?.status, err.response?.data?.message || err.message);
    return null;
  }
}

// Fetch LeetCode data — uses unofficial stats API (no auth needed)
async function fetchLeetCode(username) {
  if (!username) return null;

  // Try unofficial REST stats API first (more reliable, no CSRF issues)
  try {
    console.log(`💻 Fetching LeetCode for: ${username}`);

    const res = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`, {
      timeout: 8000,
      headers: { 'User-Agent': 'DevDash-App' }
    });

    if (res.data && res.data.status !== 'error') {
      const d = res.data;
      console.log(`✅ LeetCode fetched via stats API: ${d.totalSolved} solved`);
      return {
        totalSolved: d.totalSolved || 0,
        easySolved: d.easySolved || 0,
        mediumSolved: d.mediumSolved || 0,
        hardSolved: d.hardSolved || 0,
        ranking: d.ranking || 0,
        acceptanceRate: d.acceptanceRate ? `${d.acceptanceRate}%` : '0%',
        streak: 0,
        lastSync: new Date()
      };
    }
  } catch (err) {
    console.log('Stats API failed, trying GraphQL...', err.message);
  }

  // Fallback: LeetCode GraphQL with correct query structure
  try {
    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
          }
        }
      }
    `;

    const res = await axios.post(
      'https://leetcode.com/graphql/',
      { query, variables: { username } },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          'Origin': 'https://leetcode.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'x-csrftoken': 'abc123'
        }
      }
    );

    const data = res.data?.data?.matchedUser;
    if (!data) {
      console.log('LeetCode GraphQL: no user data returned');
      return null;
    }

    const stats = data.submitStats?.acSubmissionNum || [];
    const total = stats.find(s => s.difficulty === 'All')?.count || 0;
    const easy = stats.find(s => s.difficulty === 'Easy')?.count || 0;
    const medium = stats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hard = stats.find(s => s.difficulty === 'Hard')?.count || 0;

    console.log(`✅ LeetCode fetched via GraphQL: ${total} solved`);

    return {
      totalSolved: total,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      ranking: data.profile?.ranking || 0,
      streak: 0,
      lastSync: new Date()
    };
  } catch (err) {
    console.error('LeetCode GraphQL error:', err.response?.status, err.response?.data || err.message);
    return null;
  }
}

export async function syncAllData() {
  const users = await User.find({});
  for (const user of users) {
    const [ghData, lcData] = await Promise.all([
      fetchGitHub(user.githubUsername),
      fetchLeetCode(user.leetcodeUsername)
    ]);
    if (ghData) {
      Object.assign(user.github, ghData);
      if (ghData.avatarUrl) user.avatarUrl = ghData.avatarUrl;
    }
    if (lcData) Object.assign(user.leetcode, lcData);
    await user.save();
  }
}

// Get dashboard data
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      github: user.github,
      leetcode: user.leetcode,
      profile: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        skills: user.skills,
        githubUsername: user.githubUsername,
        leetcodeUsername: user.leetcodeUsername
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Manual sync
router.post('/sync', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.githubUsername && !user.leetcodeUsername) {
      return res.status(400).json({ message: 'Please set your GitHub or LeetCode username in Settings first.' });
    }

    const [ghData, lcData] = await Promise.all([
      fetchGitHub(user.githubUsername),
      fetchLeetCode(user.leetcodeUsername)
    ]);

    const results = { githubSynced: false, leetcodeSynced: false };

    if (ghData) {
      Object.assign(user.github, ghData);
      if (ghData.avatarUrl) user.avatarUrl = ghData.avatarUrl;
      results.githubSynced = true;
    }
    if (lcData) {
      Object.assign(user.leetcode, lcData);
      results.leetcodeSynced = true;
    }

    await user.save();

    res.json({
      message: `Synced! GitHub: ${results.githubSynced ? '✅' : '❌'}, LeetCode: ${results.leetcodeSynced ? '✅' : '❌'}`,
      ...results,
      github: user.github,
      leetcode: user.leetcode
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
