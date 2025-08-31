import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db'; // Ensure you import the db connection

export async function DELETE(request, { params }) {
  try {
    const { id } = params; // Get the school ID from the URL

    // Validate the ID is a number
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Establish connection to the MySQL database
    const connection = await db();

    // SQL query to delete the school by its ID
    const query = `DELETE FROM schools WHERE id = ?`;

    const [result] = await connection.execute(query, [id]);

    // If no rows were deleted, the school with this ID doesn't exist
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Close the DB connection
    await connection.end();

    // Return a successful response
    return NextResponse.json({ message: 'School deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
