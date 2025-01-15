import { NextRequest, NextResponse } from 'next/server';
export async function handler(req: NextRequest, res: NextResponse) {

    try {
        const data = await req.json()
        console.log(data, "data")
        return NextResponse.json({ status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 500 });

    }
}