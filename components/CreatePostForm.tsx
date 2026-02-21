'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Ο τίτλος πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
    }).max(100, {
        message: 'Ο τίτλος δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες.',
    }),
    imageUrl: z.string().url({
        message: 'Παρακαλώ εισάγετε ένα έγκυρο URL εικόνας.',
    }),
    content: z.string().min(10, {
        message: 'Το περιεχόμενο πρέπει να είναι τουλάχιστον 10 χαρακτήρες.',
    }),
});

interface CreatePostFormProps {
    authorId?: string;
    onSuccess?: () => void;
    hideHeader?: boolean;
    initialData?: {
        id: string;
        title: string;
        imageUrl: string;
        content: string;
    } | null;
}

export default function CreatePostForm({ authorId, onSuccess, hideHeader = false, initialData }: CreatePostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || '',
            imageUrl: initialData?.imageUrl || '',
            content: initialData?.content || '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const isEditing = !!initialData;
            const url = isEditing ? `/api/articles/${initialData.id}` : '/api/articles';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    authorId: authorId
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setSuccess(true);
            form.reset();
            if (onSuccess) {
                onSuccess();
            }
            router.refresh();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    const content = (
        <>
            {success && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md border border-green-200">
                    {initialData ? 'Η ανάρτηση ενημερώθηκε επιτυχώς!' : 'Η ανάρτηση δημιουργήθηκε επιτυχώς!'}
                </div>
            )}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
                    Σφάλμα: {error}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Τίτλος</FormLabel>
                                <FormControl>
                                    <Input placeholder="Εισάγετε τίτλο..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL Εικόνας</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/image.jpg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Περιεχόμενο</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Γράψτε το κείμενο της ανάρτησης εδώ..."
                                        className="min-h-[200px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-full text-lg py-6 font-semibold shadow-md hover:shadow-lg transition-all">
                        {loading ? 'Αποθήκευση...' : (initialData ? 'Ενημέρωση Ανάρτησης' : 'Δημοσίευση Ανάρτησης')}
                    </Button>
                </form>
            </Form>
        </>
    );

    if (hideHeader) {
        return <div className="p-1">{content}</div>;
    }

    return (
        <Card className="w-full border-primary/20 shadow-lg">
            <CardHeader className="bg-[var(--primary)] text-white rounded-t-lg">
                <CardTitle className="text-2xl font-serif">{initialData ? 'Επεξεργασία Ανάρτησης' : 'Νέα Ανάρτηση'}</CardTitle>
                <CardDescription className="text-white/80">
                    {initialData ? 'Κάντε τις αλλαγές σας και αποθηκεύστε.' : 'Συμπληρώστε τη φόρμα για να δημιουργήσετε μια νέα ανάρτηση.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-6">
                {content}
            </CardContent>
        </Card>
    );
}
