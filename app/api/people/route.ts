import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const people = await prisma.person.findMany({
            include: {
                parents: true,
                children: true,
            }
        });

        // Map to match frontend expectations (using _id and ID arrays)
        const formattedPeople = people.map(p => ({
            ...p,
            _id: p.id,
            parents: p.parents.map(parent => parent.id),
            children: p.children.map(child => child.id),
        }));

        return NextResponse.json(formattedPeople);
    } catch (error) {
        console.error('Failed to fetch people:', error);
        return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Extract connection info
        const { parentId, ...personData } = data;

        const person = await prisma.person.create({
            data: {
                ...personData,
                firstName: personData.firstName || '',
                lastName: personData.lastName || '',
                birthDate: personData.birthDate || '',
                isLiving: personData.isLiving !== undefined ? personData.isLiving : true,
                parents: parentId ? { connect: { id: parentId } } : undefined,
            },
            include: {
                parents: true,
                children: true,
            }
        });

        return NextResponse.json({
            ...person,
            _id: person.id,
            parents: person.parents.map(p => p.id),
            children: person.children.map(c => c.id),
        });
    } catch (error) {
        console.error('Failed to create person:', error);
        return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
    }
}
