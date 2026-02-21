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
import { Search, Loader2, Trash2, Edit, ExternalLink, Plus } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useDebounce } from 'use-debounce';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreatePostForm from '@/components/CreatePostForm';

export default function ArticlesTab() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<any>(null);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/articles?page=${page}&search=${debouncedSearch}&limit=20`);
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
    }, [page, debouncedSearch]);

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
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Αναζήτηση άρθρων..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[var(--primary)] text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Νέο Άρθρο
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif text-[var(--primary)] mb-4">Δημιουργία Νέας Ανάρτησης</DialogTitle>
                        </DialogHeader>
                        <CreatePostForm hideHeader={true} onSuccess={() => {
                            setIsCreateOpen(false);
                            fetchArticles();
                        }} />
                    </DialogContent>
                </Dialog>

                <Dialog open={!!editingArticle} onOpenChange={(open) => {
                    if (!open) setEditingArticle(null);
                }}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif text-[var(--primary)] mb-4">Επεξεργασία Ανάρτησης</DialogTitle>
                        </DialogHeader>
                        {editingArticle && (
                            <CreatePostForm
                                hideHeader={true}
                                initialData={editingArticle}
                                onSuccess={() => {
                                    setEditingArticle(null);
                                    fetchArticles();
                                }}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-bold">Τίτλος</TableHead>
                            <TableHead className="font-bold">Συντάκτης</TableHead>
                            <TableHead className="font-bold">Ημερομηνία</TableHead>
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
                                    Δεν βρέθηκαν άρθρα.
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article) => (
                                <TableRow key={article.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{article.title}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">{article.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal">
                                            {article.author.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(article.createdAt).toLocaleDateString('el-GR')}
                                    </TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Link href={`/news/${article.slug}`} target="_blank">
                                            <Button variant="ghost" size="icon" title="Προβολή">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" title="Επεξεργασία" onClick={() => setEditingArticle(article)}>
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
