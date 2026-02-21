import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'

    // Clear existing data conditionally or completely
    await prisma.article.deleteMany()
    await prisma.user.deleteMany()

    // 1. Create Admin
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            name: 'Admin User',
            role: 'ADMIN',
        },
    })
    console.log(`Created admin: ${admin.email}`)

    // 2. Create multiple Authors
    const author1 = await prisma.user.create({
        data: {
            email: 'author1@example.com',
            name: 'Alice Author',
            role: 'AUTHOR',
        },
    })

    const author2 = await prisma.user.create({
        data: {
            email: 'author2@example.com',
            name: 'Bob Writer',
            role: 'AUTHOR',
        },
    })

    console.log(`Created authors: ${author1.email}, ${author2.email}`)

    // 3. Create Articles for the authors
    const article1 = await prisma.article.create({
        data: {
            slug: 'first-article',
            title: 'The First Article',
            content: 'Content of the first article goes here.',
            imageUrl: 'https://via.placeholder.com/600x400',
            authorId: author1.id,
        },
    })

    const article2 = await prisma.article.create({
        data: {
            slug: 'second-article',
            title: 'Another Great Piece',
            content: 'Exploring the depths of Next.js and Prisma.',
            imageUrl: 'https://via.placeholder.com/600x400',
            authorId: author2.id,
        },
    })

    const article3 = await prisma.article.create({
        data: {
            slug: 'bobs-thoughts',
            title: 'Bob\'s Thoughts',
            content: 'Bob shares his thoughts on the universe.',
            imageUrl: 'https://via.placeholder.com/600x400',
            authorId: author2.id,
        },
    })

    console.log('Created articles:')
    console.log(`- ${article1.title}`)
    console.log(`- ${article2.title}`)
    console.log(`- ${article3.title}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
