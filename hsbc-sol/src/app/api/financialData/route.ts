import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("prathamesh17170");

    const fraudByCategory = await db.collection("hsbc").aggregate([
      { $group: { _id: "$category", count: { $sum: "$fraud" } } }
    ]).toArray();

    const amountByMerchant = await db.collection("hsbc").aggregate([
      { $group: { _id: "$merchant", totalAmount: { $sum: "$amount" } } }
    ]).toArray();

    return NextResponse.json({ fraudByCategory, amountByMerchant });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch data' }, { status: 500 });
  }
}