import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { getSession } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const article = await prisma.article.findUnique({
            where: { id },
            include: { author: true },
        });

        if (!article) {
            return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: article });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
        const existingArticle = await prisma.article.findUnique({ where: { id } });
        if (!existingArticle) return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        if (session.role === 'AUTHOR' && existingArticle.authorId !== session.userId) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { title, content, imageUrl, authorId } = body;

        const updateData: any = {};
        if (title) {
            updateData.title = title;
            updateData.slug = slugify(title) + '-' + Math.random().toString(36).substring(2, 7);
        }
        if (content) updateData.content = content;
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (authorId) updateData.authorId = authorId;

        const article = await prisma.article.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ success: true, data: article });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
        const existingArticle = await prisma.article.findUnique({ where: { id } });
        if (!existingArticle) return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        if (session.role === 'AUTHOR' && existingArticle.authorId !== session.userId) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        await prisma.article.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
