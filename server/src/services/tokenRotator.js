// server/src/services/tokenRotator.js
require('dotenv').config();
const axios = require('axios');

class TokenRotator {
  constructor() {
    this.tokens = process.env.GITHUB_TOKENS?.split(',').map(t => t.trim());
    this.currentIndex = 0;
    this.rateLimitedUntil = {};
  }

  getCurrentToken() {
    return this.tokens[this.currentIndex % this.tokens?.length];
  }

  markRateLimited(token, resetTime) {
    this.rateLimitedUntil[token] = resetTime * 1000;
    console.warn(`[rotator] token ...${token.slice(-6)} limited until ${new Date(resetTime * 1000)}`);
    this.currentIndex++;
  }

  getAvailableToken() {
    const now = Date.now();

    for (let i = 0; i < this.tokens?.length; i++) {
      const token = this.tokens[this.currentIndex % this.tokens?.length];
      const limitedUntil = this.rateLimitedUntil[token];

      if (!limitedUntil || now > limitedUntil) {
        return token;
      }
      this.currentIndex++;
    }

    console.error('[rotator] all tokens rate limited');
    return this.tokens[0];
  }
}

const rotator = new TokenRotator();

const gh = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github+json' },
  
});

// inject token before every request
gh.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${rotator.getAvailableToken()}`;
  return config;
});

// auto rotate on 403
gh.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      const token = rotator.getCurrentToken();
      const resetTime = error.response.headers['x-ratelimit-reset'];
      rotator.markRateLimited(token, resetTime);

      // retry same request with new token
      const config = error.config;
      config.headers.Authorization = `Bearer ${rotator.getAvailableToken()}`;
      return axios(config);
    }
    return Promise.reject(error);
  }
);

module.exports = gh;