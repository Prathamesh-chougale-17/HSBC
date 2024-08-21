import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {

  const {userId} = auth()

  if(!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const merchant = searchParams.get('merchant');
  const ageRange = searchParams.get('ageRange');

  try {
    const client = await clientPromise;
    const db = client.db("prathamesh17170");
    const collection = db.collection("hsbc");

    let matchStage: any = {};
    if (category) matchStage.category = category;
    if (merchant) matchStage.merchant = merchant;
    if (ageRange) {
      const [min, max] = ageRange.split('-').map(Number);
      matchStage.age = { $gte: min.toString(), $lte: max.toString() };
    }

    const [
      fraudByCategory,
      amountByMerchant,
      ageDistribution,
      genderDistribution,
      fraudByZipcode,
      topMerchants,
      customerBehavior,
      fraudIndicators,
      geographicalAnalysis,
      stepAnalysis
    ] = await Promise.all([
      collection.aggregate([
        { $match: matchStage },
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
        { $match: matchStage },
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
        { $match: matchStage },
        { $group: { _id: "$age", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]).toArray(),
      collection.aggregate([
        { $match: matchStage },
        { $group: { _id: "$gender", count: { $sum: 1 } } }
      ]).toArray(),
      collection.aggregate([
        { $match: matchStage },
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
        { $match: matchStage },
        { $group: { _id: "$merchant", totalAmount: { $sum: "$amount" } } },
        { $sort: { totalAmount: -1 } },
        { $limit: 10 }
      ]).toArray(),
      collection.aggregate([
        { $match: matchStage },
        { $group: {
          _id: { age: "$age", gender: "$gender", category: "$category" },
          count: { $sum: 1 },
          fraudCount: { $sum: "$fraud" },
          totalAmount: { $sum: "$amount" }
        }},
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]).toArray(),
      collection.aggregate([
        { $match: matchStage },
        { $group: {
          _id: { amount: { $round: [{ $divide: ["$amount", 100] }, 0] }, fraud: "$fraud" },
          count: { $sum: 1 }
        }},
        { $sort: { "_id.amount": 1 } }
      ]).toArray(),
      collection.aggregate([
        { $match: matchStage },
        { $group: {
          _id: { customerZip: "$zipcodeOri", merchantZip: "$zipMerchant", fraud: "$fraud" },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }},
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]).toArray(),
      collection.aggregate([
        { $match: matchStage },
        { $group: {
          _id: "$step",
          fraudCount: { $sum: "$fraud" },
          totalCount: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }},
        { $sort: { _id: 1 } }
      ]).toArray()
    ]);

    return NextResponse.json({
      fraudByCategory,
      amountByMerchant,
      ageDistribution,
      genderDistribution,
      fraudByZipcode,
      topMerchants,
      customerBehavior,
      fraudIndicators,
      geographicalAnalysis,
      stepAnalysis
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch data' }, { status: 500 });
  }
}