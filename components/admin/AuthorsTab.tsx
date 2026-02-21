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
import { Search, Loader2, Trash2, Edit, Plus, UserCheck, Shield } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useDebounce } from 'use-debounce';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function AuthorsTab() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'AUTHOR' });
    const [creating, setCreating] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch all users (no role filter by default now, or we can add one)
            const res = await fetch(`/api/authors?page=${page}&search=${debouncedSearch}&limit=20&role=all`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, debouncedSearch]);

    const handleCreate = async () => {
        if (!newUser.name || !newUser.email) return;
        setCreating(true);
        try {
            const res = await fetch('/api/authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            if (res.ok) {
                setIsCreateOpen(false);
                setNewUser({ name: '', email: '', role: 'AUTHOR' });
                fetchUsers();
            }
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Θέλετε σίγουρα να διαγράψετε αυτόν τον χρήστη;')) return;
        try {
            const res = await fetch(`/api/authors/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Αναζήτηση χρηστών..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[var(--primary)] text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Νέος Χρήστης
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Προσθήκη Νέου Χρήστη</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Όνομα</Label>
                                <Input
                                    id="name"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Ρόλος</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={(val) => setNewUser({ ...newUser, role: val })}
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Επιλέξτε ρόλο" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AUTHOR">Συντάκτης (Author)</SelectItem>
                                        <SelectItem value="ADMIN">Διαχειριστής (Admin)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Ακύρωση</Button>
                            <Button onClick={handleCreate} disabled={creating}>
                                {creating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Προσθήκη'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-bold">Όνομα</TableHead>
                            <TableHead className="font-bold">Email</TableHead>
                            <TableHead className="font-bold">Ρόλος</TableHead>
                            <TableHead className="font-bold text-center">Άρθρα</TableHead>
                            <TableHead className="font-bold text-right">Ενέργειες</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    <Loader2 className="animate-spin h-8 w-8 mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    Δεν βρέθηκαν χρήστες.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.role === 'ADMIN' ? (
                                            <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
                                                <Shield className="mr-1 h-3 w-3" />
                                                Admin
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
                                                <UserCheck className="mr-1 h-3 w-3" />
                                                Author
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">{user._count?.articles || 0}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" className="hover:text-primary">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:text-destructive"
                                            onClick={() => handleDelete(user.id)}
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
