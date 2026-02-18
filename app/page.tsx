import Link from 'next/link';
import Image from 'next/image';
// import dbConnect from '@/lib/dbConnect';
// import Article from '@/models/Article';
import { mockArticles } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import * as motion from 'framer-motion/client';

// Force dynamic rendering since we are fetching data from DB that might change
export const dynamic = 'force-dynamic';

async function getLatestArticles() {
  // await dbConnect();
  // Lean returns plain JS objects, easier for serialization
  // return Article.find({}).sort({ createdAt: -1 }).limit(3).lean(); 
  return Promise.resolve(mockArticles.slice(0, 3));
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default async function Home() {
  const articles = await getLatestArticles();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="container px-4 md:px-6 mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative w-40 h-40 md:w-56 md:h-56 mb-8 rounded-full border-4 border-[var(--primary)] overflow-hidden shadow-xl"
          >
            <Image
              src="/assets/logo.jpg"
              alt="Πολιτιστικός Σύλλογος Μέσης Logo"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-serif text-[var(--primary)] mb-4"
          >
            Πολιτιστικός Σύλλογος Μέσης
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-[700px] text-muted-foreground md:text-xl font-light italic"
          >
            Διατήρηση της παράδοσης και του πολιτισμού του τόπου μας.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Link href="/news">
              <Button size="lg" className="font-semibold">
                Δείτε τα Νέα μας
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Latest News Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-serif text-[var(--primary)]">
              Τελευταία Νέα
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Ενημερωθείτε για τις τελευταίες δράσεις και εκδηλώσεις μας.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {articles.map((article: any) => (
              <motion.div key={article._id.toString()} variants={itemVariants}>
                <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow border-primary/20 h-full">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={article.imageUrl || '/placeholder.svg'}
                      alt={article.title}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-xl font-serif text-[var(--primary)]">
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
              <div className="col-span-full text-center text-muted-foreground py-12">
                Δεν υπάρχουν άρθρα ακόμα.
              </div>
            )}
          </motion.div>

          <div className="flex justify-center mt-12">
            <Link href="/news">
              <Button variant="ghost" size="lg" className="text-[var(--primary)] hover:text-[var(--primary)]/80 hover:bg-[var(--primary)]/10">
                Προβολή Όλων των Άρθρων
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
