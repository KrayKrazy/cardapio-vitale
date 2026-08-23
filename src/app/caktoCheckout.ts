import axios from 'axios';

export async function createCaktoPix(amount: number, customerName: string, phone: string, cartItems: any[]) {
  const CAKTO_API_KEY = process.env.CAKTO_API_KEY;
  
  const payload = {
    payment_method: "pix",
    amount: amount,
    customer: {
      name: customerName,
      phone: phone
    },
    metadata: {
      cart: JSON.stringify(cartItems)
    }
  };

  try {
    const response = await axios.post('https://api.cakto.com.br/v1/charges', payload, {
      headers: {
        'Authorization': 'Bearer ' + CAKTO_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Cakto Error:', error);
    throw error;
  }
}