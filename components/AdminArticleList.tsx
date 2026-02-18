'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface Article {
    _id: string;
    title: string;
    createdAt: string;
}

export default function AdminArticleList({ articles }: { articles: Article[] }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function handleDelete(id: string) {
        if (!confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε αυτό το άρθρο;')) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/articles/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            router.refresh();
        } catch (error) {
            alert('Σφάλμα κατά τη διαγραφή');
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <Card className="w-full border-primary/20 shadow-lg h-fit">
            <CardHeader className="bg-[var(--primary)] text-white rounded-t-lg">
                <CardTitle className="text-2xl font-serif">Υπάρχουσες Αναρτήσεις</CardTitle>
            </CardHeader>
            <CardContent className="mt-6">
                <div className="space-y-4">
                    {articles.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">Δεν υπάρχουν αναρτήσεις.</p>
                    ) : (
                        articles.map((article) => (
                            <div key={article._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div>
                                    <h3 className="font-semibold line-clamp-1">{article.title}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(article.createdAt).toLocaleDateString('el-GR')}
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    disabled={deletingId === article._id}
                                    onClick={() => handleDelete(article._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
