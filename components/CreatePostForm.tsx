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
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Ο τίτλος πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
    }).max(100, {
        message: 'Ο τίτλος δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες.',
    }),
    imageUrl: z.string().min(1, {
        message: 'Παρακαλώ ανεβάστε μια εικόνα ή εισάγετε ένα URL.',
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
    const [uploading, setUploading] = useState(false);
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

    const imageUrl = form.watch('imageUrl');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Η μεταφόρτωση απέτυχε');
            }

            form.setValue('imageUrl', data.url);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setUploading(false);
        }
    };

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
                throw new Error(data.error || 'Κάτι πήγε στραβά');
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

                    <div className="space-y-4">
                        <FormLabel>Εικόνα Άρθρου</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="cursor-pointer"
                                        disabled={uploading}
                                    />
                                    {uploading && <Loader2 className="animate-spin h-5 w-5 text-primary" />}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <ImageIcon className="h-3 w-3" />
                                    <span>Ή εισάγετε απευθείας URL:</span>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input placeholder="https://example.com/image.jpg" {...field} />
                                        </FormControl>
                                    )}
                                />
                                <FormMessage>{form.formState.errors.imageUrl?.message}</FormMessage>
                            </div>

                            <div className="border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30 relative overflow-hidden h-[150px]">
                                {imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 rounded-full"
                                            onClick={() => form.setValue('imageUrl', '')}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-muted-foreground">
                                        <Upload className="h-8 w-8 mb-2 opacity-50" />
                                        <span className="text-xs">Προεπισκόπηση εικόνας</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

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

                    <Button type="submit" disabled={loading || uploading} className="w-full text-lg py-6 font-semibold shadow-md hover:shadow-lg transition-all">
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
