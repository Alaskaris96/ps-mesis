import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Aktinidio0!'

    // Clear existing data conditionally or completely
    await prisma.article.deleteMany()
    await prisma.user.deleteMany()

    // 1. Create Admin
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            password: adminPassword,
            name: 'Διαχειριστής',
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
            slug: 'general-assembly-2026-results',
            title: 'Αποτελέσματα 1ης Γενικής Συνέλευσης 2026',
            content: `Με επιτυχία ολοκληρώθηκε η 1η Γενική Συνέλευση του Συλλόγου μας στις 8/3/2026! 🗳️ Μετά την καταμέτρηση των ψήφων, το νέο 5μελές Διοικητικό Συμβούλιο συγκροτήθηκε σε σώμα ως εξής:
👤 Πρόεδρος: Τρούπκος Κωνσταντίνος (104 ψήφοι)
👤 Αντιπρόεδρος: Γιαννόπουλος Βασίλειος (66 ψήφοι)
👤 Γραμματέας: Μελικιώτου Καλλιόπη (76 ψήφοι)
👤 Αναπληρωτής Γραμματέας: Λάσκαρης Ανδρέας (56 ψήφοι)
👤 Ταμίας: Γιαννοπούλου Μαρία (89 ψήφοι)
Συνεχίζουμε δυναμικά! Οι εγγραφές νέων μελών συνεχίζονται κανονικά. 📝
📍 Πού θα μας βρείτε: Στο γραφείο μας στο Συνοικιακό Κτήριο Μέσης.
Δευτέρα και Τετάρτη από τις 19:00 έως 21:00`,
            imageUrl: 'https://images.unsplash.com/photo-1517245385169-d238b33444a1?auto=format&fit=crop&q=80&w=800',
            authorId: admin.id,
        },
    })

    const article3 = await prisma.article.create({
        data: {
            slug: 'second-article',
            title: 'Another Great Piece',
            content: 'Exploring the depths of Next.js and Prisma.',
            imageUrl: 'https://via.placeholder.com/600x400',
            authorId: author2.id,
        },
    })

    const article4 = await prisma.article.create({
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
    console.log(`- ${article4.title}`)

    // 4. Create Family Tree People
    console.log('Seeding family tree...')
    await prisma.person.deleteMany()

    // 1st Generation (Grandparents)
    const gp1 = await prisma.person.create({
        data: {
            firstName: 'Νικόλαος',
            lastName: 'Παπαδόπουλος',
            birthDate: '1920',
            deathDate: '1995',
            isLiving: false,
        }
    })

    const gp2 = await prisma.person.create({
        data: {
            firstName: 'Ελένη',
            lastName: 'Παπαδοπούλου',
            birthDate: '1925',
            deathDate: '2005',
            isLiving: false,
        }
    })

    // 2nd Generation (Parents)
    const p1 = await prisma.person.create({
        data: {
            firstName: 'Γεώργιος',
            lastName: 'Παπαδόπουλος',
            birthDate: '1950',
            isLiving: true,
            parents: {
                connect: [{ id: gp1.id }, { id: gp2.id }]
            }
        }
    })

    const p2 = await prisma.person.create({
        data: {
            firstName: 'Μαρία',
            lastName: 'Δημητρίου',
            birthDate: '1955',
            isLiving: true,
        }
    })

    // 3rd Generation (Children)
    const c1 = await prisma.person.create({
        data: {
            firstName: 'Ιωάννης',
            lastName: 'Παπαδόπουλος',
            birthDate: '1980',
            isLiving: true,
            parents: {
                connect: [{ id: p1.id }, { id: p2.id }]
            }
        }
    })

    const c2 = await prisma.person.create({
        data: {
            firstName: 'Αικατερίνη',
            lastName: 'Παπαδοπούλου',
            birthDate: '1985',
            isLiving: true,
            parents: {
                connect: [{ id: p1.id }, { id: p2.id }]
            }
        }
    })

    console.log('Family tree seeded successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
