import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const analyticsFilePath = path.join(process.cwd(), 'data', 'analytics.json');

export interface DailyStat {
  date: string; // YYYY-MM-DD
  pageViews: number;
  scrollDepth: number;
  engagements: number;
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'scroll_depth' | 'engagement';
  details?: string;
  timestamp: string;
}

export interface AnalyticsData {
  pageViews: number;
  scrollDepth: number;
  engagements: number;
  lastUpdated: string;
  dailyStats: DailyStat[];
  events: AnalyticsEvent[];
}

// ─── LOCAL JSON STORAGE HELPERS ─────────────────────────────────────────────
// Note for Production / Vercel deployment:
// Replace readAnalytics / writeAnalytics with database queries (e.g. Vercel Postgres / Supabase / Prisma).
// Example Vercel Postgres:
// import { sql } from '@vercel/postgres';
// const { rows } = await sql`SELECT * FROM analytics_summary WHERE id = 1`;

function readAnalytics(): AnalyticsData {
  try {
    if (!fs.existsSync(analyticsFilePath)) {
      const dirPath = path.dirname(analyticsFilePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      const initialData: AnalyticsData = {
        pageViews: 0,
        scrollDepth: 0,
        engagements: 0,
        lastUpdated: new Date().toISOString(),
        dailyStats: [],
        events: [],
      };
      fs.writeFileSync(analyticsFilePath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const fileData = fs.readFileSync(analyticsFilePath, 'utf8');
    const data = JSON.parse(fileData);
    return {
      pageViews: data.pageViews || 0,
      scrollDepth: data.scrollDepth || 0,
      engagements: data.engagements || 0,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      dailyStats: data.dailyStats || [],
      events: data.events || [],
    };
  } catch (error) {
    console.error('Error reading analytics file:', error);
    return {
      pageViews: 0,
      scrollDepth: 0,
      engagements: 0,
      lastUpdated: new Date().toISOString(),
      dailyStats: [],
      events: [],
    };
  }
}

function writeAnalytics(data: AnalyticsData) {
  try {
    const dirPath = path.dirname(analyticsFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(analyticsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing analytics file:', error);
  }
}

// GET — returns full analytics data summary
export async function GET() {
  const data = readAnalytics();
  return NextResponse.json(data);
}

// POST — records a new analytics event (page_view, scroll_depth, engagement)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, details } = body;

    if (!type || !['page_view', 'scroll_depth', 'engagement'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid or missing event type (page_view, scroll_depth, engagement)' },
        { status: 400 }
      );
    }

    const data = readAnalytics();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // 1. Update overall totals
    if (type === 'page_view') data.pageViews += 1;
    if (type === 'scroll_depth') data.scrollDepth += 1;
    if (type === 'engagement') data.engagements += 1;

    data.lastUpdated = now.toISOString();

    // 2. Update daily breakdown
    let todayStat = data.dailyStats.find((s) => s.date === dateStr);
    if (!todayStat) {
      todayStat = { date: dateStr, pageViews: 0, scrollDepth: 0, engagements: 0 };
      data.dailyStats.push(todayStat);
    }

    if (type === 'page_view') todayStat.pageViews += 1;
    if (type === 'scroll_depth') todayStat.scrollDepth += 1;
    if (type === 'engagement') todayStat.engagements += 1;

    // Keep last 30 days of daily stats
    data.dailyStats = data.dailyStats
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    // 3. Log event
    const newEvent: AnalyticsEvent = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      type,
      details,
      timestamp: now.toISOString(),
    };

    data.events = [newEvent, ...(data.events || [])].slice(0, 100); // Keep last 100 events

    writeAnalytics(data);

    return NextResponse.json({ success: true, event: newEvent, totals: {
      pageViews: data.pageViews,
      scrollDepth: data.scrollDepth,
      engagements: data.engagements,
    } });
  } catch (error) {
    console.error('Error in analytics POST route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
