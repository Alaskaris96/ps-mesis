'use client';

import { useState, useEffect } from 'react';
import AuthorArticles from '@/components/author/AuthorArticles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCircle, Loader2 } from 'lucide-react';

export default function AuthorPanelPage() {
    const [authors, setAuthors] = useState<any[]>([]);
    const [selectedAuthorId, setSelectedAuthorId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                // Specifically request only users with role AUTHOR
                const res = await fetch('/api/authors?role=AUTHOR');
                const data = await res.json();
                if (data.success) {
                    setAuthors(data.data);
                    if (data.data.length > 0) {
                        setSelectedAuthorId(data.data[0].id);
                    }
                }
            } catch (error) {
                console.error('Error fetching authors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container px-4 py-12 mx-auto min-h-screen">
            <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-4xl font-bold font-serif text-[var(--primary)]">
                        Πίνακας Συντάκτη
                    </h1>

                    <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full border shadow-sm">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <UserCircle className="h-6 w-6 text-primary" />
                        </div>
                        <Select value={selectedAuthorId} onValueChange={setSelectedAuthorId}>
                            <SelectTrigger className="w-[200px] border-none shadow-none focus:ring-0">
                                <SelectValue placeholder="Επιλογή Συντάκτη" />
                            </SelectTrigger>
                            <SelectContent>
                                {authors.map((author) => (
                                    <SelectItem key={author.id} value={author.id}>
                                        {author.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {selectedAuthorId ? (
                    <AuthorArticles authorId={selectedAuthorId} />
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center text-muted-foreground">
                            Δεν βρέθηκαν συντάκτες. Παρακαλώ δημιουργήστε έναν από τον πίνακα Admin.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
