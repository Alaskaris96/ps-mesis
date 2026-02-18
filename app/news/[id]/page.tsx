// import dbConnect from '@/lib/dbConnect';
// import Article from '@/models/Article';
import { mockArticles } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import * as motion from 'framer-motion/client';

export const dynamic = 'force-dynamic';

async function getArticle(id: string) {
    // await dbConnect();
    // try {
    //     const article = await Article.findById(id).lean();
    //     if (!article) return null;
    //     return article;
    // } catch (error) {
    //     return null;
    // }

    const article = mockArticles.find(a => a._id === id);
    return Promise.resolve(article || null);
}

export default async function SingleArticlePage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const article = await getArticle(params.id);

    if (!article) {
        notFound();
    }

    return (
        <div className="container px-4 py-8 mx-auto min-h-screen max-w-4xl">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <Link href="/news">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-[var(--primary)] text-muted-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω στα Νέα
                    </Button>
                </Link>
            </motion.div>

            <article className="flex flex-col gap-8">
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 text-center sm:text-left"
                >
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-serif text-[var(--primary)]">
                        {article.title}
                    </h1>
                    <p className="text-muted-foreground">
                        Δημοσιεύτηκε στις {new Date(article.createdAt).toLocaleDateString('el-GR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full aspect-video relative overflow-hidden rounded-lg shadow-lg border border-muted"
                >
                    <img
                        src={article.imageUrl || '/placeholder.svg'}
                        alt={article.title}
                        className="object-cover w-full h-full"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap font-sans leading-relaxed text-foreground/90"
                >
                    {article.content}
                </motion.div>
            </article>
        </div>
    );
}
