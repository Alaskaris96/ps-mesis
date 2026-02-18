import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Article from '@/models/Article';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // await dbConnect();
    const { id } = await params;

    try {
        // const article = await Article.findById(id);
        // if (!article) {
        //   return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        // }
        // return NextResponse.json({ success: true, data: article });
        return NextResponse.json({ success: true, data: { _id: id, title: 'Mock Article', content: 'Mock Content', createdAt: new Date(), imageUrl: '' } });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json();
        // const article = await Article.findByIdAndUpdate(id, body, {
        //   new: true,
        //   runValidators: true,
        // });
        // if (!article) {
        //   return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        // }
        // return NextResponse.json({ success: true, data: article });

        return NextResponse.json({ success: true, data: { ...body, _id: id } });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // await dbConnect();
    const { id } = await params;

    try {
        // const deletedArticle = await Article.deleteOne({ _id: id });
        // if (!deletedArticle) {
        //   return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        // }
        console.log('Mock deleting article:', id);
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
    }
}
