'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthorsTab from './AuthorsTab';
import ArticlesTab from './ArticlesTab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, LayoutDashboard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminDashboard({ user }: { user: any }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <Card className="w-full border-primary/20 shadow-xl overflow-hidden bg-background">
            <CardHeader className="bg-[var(--primary)] text-white p-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                        <LayoutDashboard className="h-8 w-8" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-serif">Πίνακας Ελέγχου Admin</CardTitle>
                        <CardDescription className="text-white/70 text-lg">
                            Διαχείριση χρηστών και άρθρων της πλατφόρμας.
                        </CardDescription>
                    </div>
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Αποσύνδεση
                </Button>
            </CardHeader>
            <CardContent className="p-8">
                <Tabs defaultValue="articles" className="w-full space-y-8">
                    <TabsList className="grid w-full sm:w-[400px] grid-cols-2 bg-muted p-1 rounded-lg">
                        <TabsTrigger value="articles" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2 transition-all">
                            <FileText className="mr-2 h-4 w-4" />
                            Άρθρα
                        </TabsTrigger>
                        {user.role === 'ADMIN' && (
                            <TabsTrigger value="authors" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2 transition-all">
                                <Users className="mr-2 h-4 w-4" />
                                Χρήστες
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="articles" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <ArticlesTab />
                    </TabsContent>

                    {user.role === 'ADMIN' && (
                        <TabsContent value="authors" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                            <AuthorsTab />
                        </TabsContent>
                    )}
                </Tabs>
            </CardContent>
        </Card>
    );
}
