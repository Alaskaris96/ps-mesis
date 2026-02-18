import CreatePostForm from '@/components/CreatePostForm';
import AdminArticleList from '@/components/AdminArticleList';
// import dbConnect from '@/lib/dbConnect';
// import Article from '@/models/Article';
import { mockArticles } from '@/lib/mockData';

// Ensure data is fresh
export const dynamic = 'force-dynamic';

async function getArticles() {
    // await dbConnect();
    // Fetch only necessary fields for list
    // return Article.find({}, 'title createdAt').sort({ createdAt: -1 }).lean();

    return Promise.resolve(mockArticles);
}

export default async function AdminPage() {
    const articles = await getArticles();

    // Convert to plain objects with string IDs for client component
    // Mock data is already plain objects with string IDs, so simple map if needed or just pass
    const plainArticles = articles.map((doc: any) => ({
        _id: doc._id.toString(),
        title: doc.title,
        createdAt: (new Date(doc.createdAt)).toISOString(),
    }));

    return (
        <div className="container px-4 py-8 mx-auto min-h-screen">
            <div className="flex flex-col gap-8">
                <h1 className="text-3xl font-bold font-serif text-[var(--primary)] text-center mb-4">
                    Πίνακας Διαχείρισης
                </h1>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <CreatePostForm />
                    <AdminArticleList articles={plainArticles} />
                </div>
            </div>
        </div>
    );
}
