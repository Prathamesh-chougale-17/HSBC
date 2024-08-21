import clientPromise from './mongodb';

export async function getData() {
  try {
    const client = await clientPromise;
    const db = client.db('your-database-name'); // Replace with your database name
    const collection = db.collection('your-collection-name'); // Replace with your collection name

    const data = await collection.find({}).toArray();
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw new Error('Failed to fetch data');
  }
}
