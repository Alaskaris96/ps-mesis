import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        let userRole = '';
        let userId = '';

        // Check if it's the admin
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            userRole = 'ADMIN';
            userId = 'admin-id'; // Using a placeholder ID for admin from env
        } else {
            // Check for author in database
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            // If author doesn't have a password set, let's treat 'password123' as default for now for seeding purpose
            const validPassword = (user as any).password === password || (!(user as any).password && password === 'password123');

            if (!validPassword) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            userRole = user.role;
            userId = user.id;
        }

        // Create session
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const session = await encrypt({ userId, role: userRole, email, expires });

        const cookieStore = await cookies();
        cookieStore.set('session', session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return NextResponse.json({ success: true, role: userRole });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
