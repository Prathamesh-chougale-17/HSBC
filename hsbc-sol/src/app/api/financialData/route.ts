import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("prathamesh17170");
    const collection = db.collection("hsbc");

    const [
      fraudByCategory,
      amountByMerchant,
      ageDistribution,
      genderDistribution,
      fraudByZipcode,
      topMerchants
    ] = await Promise.all([
      collection.aggregate([
        { $group: { 
          _id: "$category", 
          fraudCount: { $sum: "$fraud" }, 
          totalCount: { $sum: 1 } 
        }},
        { $project: { 
          category: "$_id", 
          fraudCount: 1, 
          fraudRate: { $divide: ["$fraudCount", "$totalCount"] } 
        }}
      ]).toArray(),
      collection.aggregate([
        { $group: { 
          _id: "$merchant", 
          totalAmount: { $sum: "$amount" }, 
          fraudAmount: { $sum: { $cond: [{ $eq: ["$fraud", 1] }, "$amount", 0] } } 
        }},
        { $project: { 
          merchant: "$_id", 
          totalAmount: 1, 
          fraudAmount: 1, 
          fraudRate: { $divide: ["$fraudAmount", "$totalAmount"] } 
        }}
      ]).toArray(),
      collection.aggregate([
        { $group: { _id: "$age", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]).toArray(),
      collection.aggregate([
        { $group: { _id: "$gender", count: { $sum: 1 } } }
      ]).toArray(),
      collection.aggregate([
        { $group: { 
          _id: "$zipcodeOri", 
          fraudCount: { $sum: "$fraud" }, 
          totalCount: { $sum: 1 } 
        }},
        { $project: { 
          zipcode: "$_id", 
          fraudRate: { $divide: ["$fraudCount", "$totalCount"] } 
        }},
        { $sort: { fraudRate: -1 } },
        { $limit: 10 }
      ]).toArray(),
      collection.aggregate([
        { $group: { _id: "$merchant", totalAmount: { $sum: "$amount" } } },
        { $sort: { totalAmount: -1 } },
        { $limit: 10 }
      ]).toArray()
    ]);

    return NextResponse.json({
      fraudByCategory,
      amountByMerchant,
      ageDistribution,
      genderDistribution,
      fraudByZipcode,
      topMerchants
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch data' }, { status: 500 });
  }
}