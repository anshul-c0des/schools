import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import cloudinary from '../../../utils/cloudinary';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      address,
      city,
      state,
      contact,
      email_id,
      imageBase64,
    } = body;

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: 'schoolImages',
      resource_type: 'image',
    });

    const imageUrl = uploadResponse.secure_url;

    const connection = await db();
    const query = `
      INSERT INTO schools (name, address, city, state, contact, image, email_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(query, [
      name,
      address,
      city,
      state,
      contact,
      imageUrl,
      email_id,
    ]);
    await connection.end();

    return NextResponse.json({ message: 'School added successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
