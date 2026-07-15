import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const commentsFilePath = path.join(process.cwd(), 'data', 'comments.json');

// Helper to read comments from file
function readComments() {
  try {
    if (!fs.existsSync(commentsFilePath)) {
      // Ensure the directory exists
      const dirPath = path.dirname(commentsFilePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(commentsFilePath, JSON.stringify([]));
      return [];
    }
    const fileData = fs.readFileSync(commentsFilePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading comments file:', error);
    return [];
  }
}

// Helper to write comments to file
function writeComments(comments: any[]) {
  try {
    const dirPath = path.dirname(commentsFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2));
  } catch (error) {
    console.error('Error writing comments file:', error);
  }
}

export async function GET() {
  const comments = readComments();
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, role } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields (name, email, message)' },
        { status: 400 }
      );
    }

    const comments = readComments();
    
    // Create new comment with pending status
    const newComment = {
      id: Date.now().toString(),
      name,
      role: role ? String(role).trim() : 'Casantiqua Client', // Use submitted role or default
      email,
      subject: subject || 'No Subject',
      message,
      status: 'pending', // Moderation required
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    writeComments(comments);

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error in comments POST route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Support updating comments (approve/reject/delete) via PUT/DELETE
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid or missing fields (id, status)' },
        { status: 400 }
      );
    }

    const comments = readComments();
    const commentIndex = comments.findIndex((c: any) => c.id === id);

    if (commentIndex === -1) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    comments[commentIndex].status = status;
    
    // If approved, give them a client role for display
    if (status === 'approved' && comments[commentIndex].role === 'Client Inquiry') {
      comments[commentIndex].role = 'Casantiqua Client';
    }

    writeComments(comments);

    return NextResponse.json({ success: true, comment: comments[commentIndex] });
  } catch (error) {
    console.error('Error in comments PUT route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH — partial field update (e.g. role/title editing by admin)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, role } = body;

    if (!id || typeof role !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing fields (id, role)' },
        { status: 400 }
      );
    }

    const comments = readComments();
    const commentIndex = comments.findIndex((c: any) => c.id === id);

    if (commentIndex === -1) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    comments[commentIndex].role = role.trim();
    writeComments(comments);

    return NextResponse.json({ success: true, comment: comments[commentIndex] });
  } catch (error) {
    console.error('Error in comments PATCH route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing comment ID' }, { status: 400 });
    }

    const comments = readComments();
    const filteredComments = comments.filter((c: any) => c.id !== id);

    if (comments.length === filteredComments.length) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    writeComments(filteredComments);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in comments DELETE route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
