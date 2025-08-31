import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const connection = await db();
    const [rows] = await connection.execute('SELECT id, name, address, city, image FROM schools');
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}
