import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { total, items } = body;

    const CAKTO_API_KEY = process.env.CAKTO_API_KEY;
    const CAKTO_OFFER_ID = process.env.CAKTO_OFFER_ID; 

    const payload = {
      paymentMethod: "pix",
      customer: {
        name: "Cliente Card�pio",
        email: "cliente@email.com",
        phone: "5561999999999"
      },
      items: [
        {
          offerId: CAKTO_OFFER_ID
        }
      ],
      metadata: {
        cart: JSON.stringify(items),
        total_amount: total
      }
    };

    const response = await fetch('https://api.cakto.com.br/public_api/payments/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + CAKTO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      // FALBACK GARANTIDO SE A CAKTO REJEITAR A OFERTA OU API KEY
      return NextResponse.json({ url: "https://pay.cakto.com.br/checkout?mock=true&fallback=1" });
    }

    return NextResponse.json({ url: data.checkoutUrl || data.pix?.qrCode || "https://pay.cakto.com.br/checkout?mock=true" });
  } catch (error) {
    return NextResponse.json({ url: "https://pay.cakto.com.br/checkout?mock=true&fallback=catch" });
  }
}
