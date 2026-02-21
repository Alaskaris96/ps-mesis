import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const session = await getSession();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    let targetAuthorId = searchParams.get('authorId');
    if (session?.role === 'AUTHOR') {
        targetAuthorId = session.userId as string;
    }

    try {
        const where = {
            ...(targetAuthorId ? { authorId: targetAuthorId } : {}),
            OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { content: { contains: search, mode: 'insensitive' as const } },
            ],
        };

        const [articles, total] = await Promise.all([
            prisma.article.findMany({
                where,
                include: { author: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.article.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: articles,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('API Error in GET articles:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { title, content, imageUrl, authorId } = body;

        let finalAuthorId = authorId;
        if (session.role === 'AUTHOR') {
            finalAuthorId = session.userId;
        } else if (!finalAuthorId) {
            // Find or create a default author user
            let author = await prisma.user.findFirst({
                where: { role: 'AUTHOR' }
            });
            if (!author) {
                author = await prisma.user.create({
                    data: {
                        name: 'Default Author',
                        email: 'author@example.com',
                        role: 'AUTHOR'
                    },
                });
            }
            finalAuthorId = author.id;
        }

        const slug = slugify(title) + '-' + Math.random().toString(36).substring(2, 7);

        const article = await prisma.article.create({
            data: {
                title,
                content,
                imageUrl,
                slug,
                authorId: finalAuthorId,
            },
        });

        return NextResponse.json({ success: true, data: article }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
