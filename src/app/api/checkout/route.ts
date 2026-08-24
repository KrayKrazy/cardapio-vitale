import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    return NextResponse.json({ url: 'https://pay.cakto.com.br/6fcwq2k' });
  } catch (error) {
    return NextResponse.json({ url: 'https://pay.cakto.com.br/6fcwq2k' });
  }
}
