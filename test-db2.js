const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
    let users = await prisma.user.findMany();
    console.log(users.map(u => u.id));
}
run();
