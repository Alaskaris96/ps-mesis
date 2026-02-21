import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role'); // Optional role filter
    const skip = (page - 1) * limit;

    try {
        const where: any = {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ],
        };

        if (role && role !== 'all') {
            where.role = role;
        } else if (!role) {
            // Default to AUTHOR for this specific endpoint if no role specified, 
            // but we might want this to be generic. 
            // For now, let's make it return AUTHORS by default to keep existing UI working.
            where.role = 'AUTHOR';
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: { _count: { select: { articles: true } } },
                orderBy: { name: 'asc' },
                skip,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('API Error in GET authors:', error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, role } = body;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                role: role || 'AUTHOR',
            },
        });

        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
