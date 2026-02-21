const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.article.findMany().then(a => console.log('Articles:', a.length));
prisma.user.findMany().then(u => console.log('Users:', u.length));
