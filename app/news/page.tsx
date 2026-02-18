import Link from 'next/link';
import { Suspense } from 'react';
// import dbConnect from '@/lib/dbConnect';
// import Article from '@/models/Article';
import { mockArticles } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Search from '@/components/Search';
import * as motion from 'framer-motion/client';

// Force dynamic rendering since search params change the output
export const dynamic = 'force-dynamic';

async function getArticles(query: string) {
    // await dbConnect();
    // const filter = query 
    //   ? { 
    //       $or: [
    //         { title: { $regex: query, $options: 'i' } },
    //         { content: { $regex: query, $options: 'i' } }
    //       ]
    //     }
    //   : {};

    // return Article.find(filter).sort({ createdAt: -1 }).lean();

    if (!query) return Promise.resolve(mockArticles);

    const lowerQuery = query.toLowerCase();
    const filtered = mockArticles.filter(a =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.content.toLowerCase().includes(lowerQuery)
    );
    return Promise.resolve(filtered);
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
                    {articles.map((article: any) => (
                        <motion.div key={article._id.toString()} variants={itemVariants}>
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
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {new Date(article.createdAt).toLocaleDateString('el-GR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {article.content}
                                    </p>
                                </CardContent>
                                <div className="p-6 pt-0 mt-auto">
                                    <Link href={`/news/${article._id.toString()}`}>
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
