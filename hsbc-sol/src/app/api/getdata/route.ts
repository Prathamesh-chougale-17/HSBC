import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(page: number = 1, limit: number = 10) {
    try {
      const client = await clientPromise;
      const db = client.db('prathamesh17170');
      const collection = db.collection('hsbc');
  
      const skip = (page - 1) * limit;
      const data = await collection.find({})
        .skip(skip)
        .limit(limit)
        .toArray();
  
      const totalDocuments = await collection.countDocuments();
  
      return {
        data,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw new Error('Failed to fetch data');
    }
  }