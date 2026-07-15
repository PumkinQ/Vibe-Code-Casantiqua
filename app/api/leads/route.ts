import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json');

export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  subject?: string;
  message: string;
  createdAt: string;
  // Fallback for any old format entries
  contact?: string;
}

// Helper to read leads from file
function readLeads(): Lead[] {
  try {
    if (!fs.existsSync(leadsFilePath)) {
      const dirPath = path.dirname(leadsFilePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(leadsFilePath, JSON.stringify([]));
      return [];
    }
    const fileData = fs.readFileSync(leadsFilePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading leads file:', error);
    return [];
  }
}

// Helper to write leads to file
function writeLeads(leads: Lead[]) {
  try {
    const dirPath = path.dirname(leadsFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(leadsFilePath, JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error('Error writing leads file:', error);
  }
}

// GET — returns all leads (admin only)
export async function GET() {
  const leads = readLeads();
  // Sort newest first
  const sorted = leads.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}

// Placeholder auto-responder functions
async function sendAutoReplyEmail(email: string, name: string) {
  // TODO: Integrate Email provider (e.g., Resend) to send an auto-reply to the client's email
  console.log(`Auto-reply email queued for ${name} <${email}>`);
}

async function sendAutoReplyWhatsApp(whatsapp: string, name: string) {
  // TODO: Integrate WhatsApp Business API to send an automated WA message
  console.log(`Auto-reply WhatsApp queued for ${name} (${whatsapp})`);
}

// POST — saves a new lead
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, subject, message } = body;

    if (!name || !email || !whatsapp || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, whatsapp, message' },
        { status: 400 }
      );
    }

    const leads = readLeads();

    const newLead: Lead = {
      id: Date.now().toString(),
      name: String(name).trim(),
      email: String(email).trim(),
      whatsapp: String(whatsapp).trim(),
      subject: subject ? String(subject).trim() : undefined,
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
    };

    leads.push(newLead);
    writeLeads(leads);

    // Auto-Responder Trigger logic
    try {
      await sendAutoReplyEmail(newLead.email, newLead.name);
      await sendAutoReplyWhatsApp(newLead.whatsapp, newLead.name);
    } catch (autoResponderError) {
      console.error('Error triggering auto-responders:', autoResponderError);
      // We don't fail the request if auto-responder fails
    }

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error('Error in leads POST route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE — removes a lead by ?id=
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing lead ID' }, { status: 400 });
    }

    const leads = readLeads();
    const filtered = leads.filter((l) => l.id !== id);

    if (filtered.length === leads.length) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    writeLeads(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in leads DELETE route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
