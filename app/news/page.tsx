import Link from 'next/link';
import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Search from '@/components/Search';
import * as motion from 'framer-motion/client';

// Force dynamic rendering since search params change the output
export const dynamic = 'force-dynamic';

async function getArticles(query: string) {
    try {
        const where = query
            ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' as const } },
                    { content: { contains: query, mode: 'insensitive' as const } },
                ],
            }
            : {};

        const articles = await prisma.article.findMany({
            where,
            include: { author: true },
            orderBy: { createdAt: 'desc' },
        });

        return articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export default async function NewsPage(props: {
    searchParams?: Promise<{
        query?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';

    const articles = await getArticles(query);

    return (
        <div className="container px-4 py-8 mx-auto min-h-screen">
            <div className="flex flex-col gap-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-4 items-center text-center"
                >
                    <h1 className="text-3xl font-bold font-serif text-[var(--primary)]">Νέα & Ανακοινώσεις</h1>
                    <p className="text-muted-foreground">
                        Διαβάστε όλα τα τελευταία νέα του συλλόγου μας.
                    </p>
                    <div className="w-full max-w-md">
                        <Suspense fallback={<div>Loading search...</div>}>
                            <Search placeholder="Αναζήτηση άρθρων..." />
                        </Suspense>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8"
                >
                    {articles.map((article) => (
                        <motion.div key={article.id} variants={itemVariants}>
                            <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-all border-primary/20 h-full">
                                <div className="relative aspect-video w-full overflow-hidden">
                                    <img
                                        src={article.imageUrl || '/placeholder.svg'}
                                        alt={article.title}
                                        className="object-cover w-full h-full transition-transform hover:scale-105"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-2 text-lg font-serif text-[var(--primary)]">
                                        {article.title}
                                    </CardTitle>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(article.createdAt).toLocaleDateString('el-GR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                            {article.author.name}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {article.content}
                                    </p>
                                </CardContent>
                                <div className="p-6 pt-0 mt-auto">
                                    <Link href={`/news/${article.slug}`}>
                                        <Button variant="outline" className="w-full group">
                                            Διαβάστε Περισσότερα
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                    {articles.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center text-muted-foreground py-12 text-lg"
                        >
                            Δεν βρέθηκαν άρθρα με αυτό τον όρο αναζήτησης.
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
