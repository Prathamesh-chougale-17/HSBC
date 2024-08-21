import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const category = searchParams.get('category');
  const merchant = searchParams.get('merchant');

  try {
    const client = await clientPromise;
    const db = client.db("prathamesh17170");
    const collection = db.collection("hsbc");

    let matchStage: any = {};
    if (startDate && endDate) {
      matchStage.step = { 
        $gte: parseInt(startDate), 
        $lte: parseInt(endDate) 
      };
    }
    if (category) matchStage.category = category;
    if (merchant) matchStage.merchant = merchant;

    const [
      transactionsByCategory,
      transactionsByMerchant,
      fraudOverTime,
      ageDistribution,
      genderDistribution,
      topMerchants,
      averageTransactionAmount,
      fraudByZipcode,
      categoryTrends,
      customerSegmentation
    ] = await Promise.all([
      collection.aggregate([
        { $match: matchStage },
        { $group: { 
          _id: "$category", 
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }},
        { $sort: { count: -1 } }
      ]).toArray(),
      collection.aggregate([
        { $match: matchStage },
        { $group: { 
          _id: "$merchant", 
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }},
        { $sort: { totalAmount: -1 } },
        { $limit: 10 }
      ]).toArray(),
      collection.aggregate([
        { $match: matchStage },
        { $group: {
          _id: "$step",
          fraudCount: { $sum: "$fraud" },
          totalCount: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
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
        { $group: { _id: "$merchant", totalAmount: { $sum: "$amount" } } },
        { $sort: { totalAmount: -1 } },
        { $limit: 5 }
      ]).toArray(),
      collection.aggregate([
        { $match: matchStage },
        { $group: {
          _id: null,
          averageAmount: { $avg: "$amount" }
        }}
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
        { $group: {
          _id: { category: "$category", step: "$step" },
          totalAmount: { $sum: "$amount" }
        }},
        { $sort: { "_id.step": 1, totalAmount: -1 } }
      ]).toArray(),
      collection.aggregate([
        { $match: matchStage },
        { $group: {
          _id: { age: "$age", gender: "$gender" },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          avgAmount: { $avg: "$amount" }
        }},
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]).toArray()
    ]);

    return NextResponse.json({
      transactionsByCategory,
      transactionsByMerchant,
      fraudOverTime,
      ageDistribution,
      genderDistribution,
      topMerchants,
      averageTransactionAmount,
      fraudByZipcode,
      categoryTrends,
      customerSegmentation
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch financial data' }, { status: 500 });
  }
}
