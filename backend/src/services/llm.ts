import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { Message } from '../types';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const STORE_KNOWLEDGE = `
You are Beacon, a friendly and helpful AI support agent for "Nova Store" - a fictional e-commerce store.

STORE INFORMATION:
- Store Name: Nova Store
- Website: novastore.com
- Support Hours: Monday to Saturday, 9 AM to 6 PM IST

SHIPPING POLICY:
- Standard shipping: 5-7 business days (FREE on orders above ₹999)
- Express shipping: 2-3 business days (₹149 flat fee)
- Same-day delivery: Available in Mumbai, Delhi, Bangalore, Hyderabad (₹249 flat fee)
- International shipping: Available to USA, UK, UAE, Singapore (7-14 business days, fees vary by location)
- All orders are tracked and a tracking link is emailed once dispatched

RETURN & REFUND POLICY:
- Returns accepted within 30 days of delivery
- Item must be unused, unwashed, and in original packaging
- To initiate a return: email returns@novastore.com or use the Returns Portal on the website
- Refunds are processed within 5-7 business days after we receive the returned item
- Refunds go back to the original payment method
- Exchange is also available instead of refund if preferred

PAYMENT METHODS:
- Credit/Debit cards (Visa, Mastercard, Rupay)
- UPI (GPay, PhonePe, Paytm)
- Net Banking
- Cash on Delivery (available on orders below ₹5000)
- EMI available on orders above ₹2000

CONTACT & SUPPORT:
- Email: support@novastore.com
- Phone: 1800-XXX-XXXX (toll-free, Mon-Sat 9AM-6PM IST)
- Live Chat: Available on website during support hours

COMMON ISSUES:
- Order not received: Check tracking link in email, or contact support with order ID
- Wrong item received: Email support@novastore.com with photo evidence within 48 hours
- Damaged item: Report within 48 hours of delivery with photos for immediate replacement
- Cancellation: Orders can be cancelled within 1 hour of placing, before dispatch
`;

const SYSTEM_PROMPT = `${STORE_KNOWLEDGE}

BEHAVIOR GUIDELINES:
- Always be polite, concise, and helpful
- If you don't know something specific, say so honestly and direct the user to contact support
- Keep responses short and to the point — avoid long paragraphs
- Use bullet points when listing multiple items
- Never make up information not provided above
- If asked something unrelated to the store, politely redirect the conversation
`;

const MAX_HISTORY_MESSAGES = 10;

export const generateReply = async (
  history: Message[],
  userMessage: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build conversation history for Gemini
    const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);

    const chatHistory = recentHistory.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      return 'I apologize, I could not generate a response. Please try again.';
    }

    return text;

  } catch (err: unknown) {
    console.error('❌ LLM error:', err);

    if (err instanceof Error) {
      if (err.message.includes('API_KEY_INVALID') || err.message.includes('API key not valid')) {
        return 'I am currently unavailable due to a configuration issue. Please contact support@novastore.com for help.';
      }
      if (err.message.includes('RATE_LIMIT') || err.message.includes('429')) {
        return 'I am receiving too many requests right now. Please wait a moment and try again.';
      }
      if (err.message.includes('SAFETY')) {
        return 'I am unable to respond to that message. Please rephrase your question.';
      }
    }

    return 'I am having trouble connecting right now. Please try again or contact support@novastore.com.';
  }
};