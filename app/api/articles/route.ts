import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Article from '@/models/Article';

export async function GET() {
    // await dbConnect();

    try {
        // const articles = await Article.find({}).sort({ createdAt: -1 });
        // return NextResponse.json({ success: true, data: articles });
        return NextResponse.json({ success: true, data: [] }); // Empty for now or mock
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function POST(request: Request) {
    // await dbConnect();

    try {
        const body = await request.json();
        // const article = await Article.create(body);
        // return NextResponse.json({ success: true, data: article }, { status: 201 });
        console.log('Mock creating article:', body);
        return NextResponse.json({ success: true, data: { ...body, _id: 'mock_new_id', createdAt: new Date() } }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
