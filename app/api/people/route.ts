import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Person from '@/models/Person';

export async function GET() {
    try {
        await dbConnect();
        const people = await Person.find({});
        return NextResponse.json(people);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const person = await Person.create(data);

        // If there's a parentId, update the parent's children array
        if (data.parentId) {
            await Person.findByIdAndUpdate(data.parentId, {
                $push: { children: person._id }
            });
            // Also update person's parents array
            await Person.findByIdAndUpdate(person._id, {
                $push: { parents: data.parentId }
            });
        }

        return NextResponse.json(person);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
    }
}
