'use client';

import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Trash2, Edit, Plus, ExternalLink } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import CreatePostForm from '@/components/CreatePostForm';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

export default function AuthorArticles({ authorId }: { authorId: string }) {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchArticles = async () => {
        if (!authorId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/articles?authorId=${authorId}&search=${debouncedSearch}&page=${page}&limit=20`);
            const data = await res.json();
            if (data.success) {
                setArticles(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [authorId, debouncedSearch, page]);

    const handleDelete = async (id: string) => {
        if (!confirm('Θέλετε σίγουρα να διαγράψετε αυτό το άρθρο;')) return;
        try {
            const res = await fetch(`/api/articles/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchArticles();
            }
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Αναζήτηση στα άρθρα μου..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[var(--primary)] text-white w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Νέα Ανάρτηση
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Δημιουργία Νέας Ανάρτησης</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            <CreatePostForm authorId={authorId} hideHeader onSuccess={() => {
                                setIsCreateOpen(false);
                                fetchArticles();
                            }} />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-bold">Τίτλος</TableHead>
                            <TableHead className="font-bold">Ημερομηνία</TableHead>
                            <TableHead className="font-bold">Slug</TableHead>
                            <TableHead className="font-bold text-right">Ενέργειες</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                    <Loader2 className="animate-spin h-8 w-8 mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                    Δεν έχετε δημοσιεύσει ακόμα άρθρα.
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article) => (
                                <TableRow key={article.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(article.createdAt).toLocaleDateString('el-GR')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            {article.slug}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Link href={`/news/${article.slug}`} target="_blank">
                                            <Button variant="ghost" size="icon" title="Προβολή">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" title="Επεξεργασία">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:text-destructive"
                                            title="Διαγραφή"
                                            onClick={() => handleDelete(article.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                                    isActive={page === i + 1}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
