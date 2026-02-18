import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Person from '@/models/Person';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const person = await Person.findById(id);
        if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(person);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const data = await request.json();
        const person = await Person.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(person);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        // Remove person and cleanup references
        const person = await Person.findById(id);
        if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Remove from parents' children arrays
        await Person.updateMany(
            { _id: { $in: person.parents } },
            { $pull: { children: id } }
        );

        // Remove from children's parents arrays
        await Person.updateMany(
            { _id: { $in: person.children } },
            { $pull: { parents: id } }
        );

        await Person.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
