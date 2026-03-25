// server/src/db/prisma.js


const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient({
  log: [ 'error'],
});

module.exports = prisma;