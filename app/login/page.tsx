'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push('/admin');
            router.refresh(); // Force refresh to update navigation states
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-xl border-primary/20">
                <CardHeader className="space-y-1 text-center bg-[var(--primary)] text-white p-6 rounded-t-xl">
                    <CardTitle className="text-3xl font-serif tracking-tight">Σύνδεση Συστήματος</CardTitle>
                    <CardDescription className="text-white/80">
                        Εισάγετε τα στοιχεία σας για να αποκτήσετε πρόσβαση
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="author@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full text-lg p-6 bg-gray-50/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">Κωδικός</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full text-lg p-6 bg-gray-50/50"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md animate-in fade-in slide-in-from-top-2 text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-lg py-6"
                            disabled={loading}
                        >
                            {loading ? 'Σύνδεση...' : 'Είσοδος'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                    <p className="text-sm text-gray-500 text-center">
                        Η πρόσβαση επιτρέπεται μόνο σε εξουσιοδοτημένους χρήστες.<br />
                        Για συγγραφείς, ο προεπιλεγμένος κωδικός είναι <code className="bg-gray-100 px-1 rounded">password123</code>.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
