import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const person = await prisma.person.findUnique({
            where: { id },
            include: {
                parents: true,
                children: true,
            }
        });

        if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({
            ...person,
            _id: person.id,
            parents: person.parents.map(p => p.id),
            children: person.children.map(c => c.id),
        });
    } catch (error) {
        console.error('Failed to fetch person:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        const person = await prisma.person.update({
            where: { id },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate,
                deathDate: data.deathDate,
                isLiving: data.isLiving,
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
        console.error('Failed to update person:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // In Prisma, deleting a record will NOT automatically remove it from many-to-many junction tables?
        // Actually, with implicit many-to-many, Prisma handles it if you delete the record.
        // It will remove entries in the junction table.

        await prisma.person.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete person:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
