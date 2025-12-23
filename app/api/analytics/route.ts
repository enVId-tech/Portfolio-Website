import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('[Analytics] Received event:', data);

    // Append to a simple log file for local/dev inspection.
    try {
      const root = process.cwd();
      const filePath = path.join(root, 'analytics.log');
      const line = JSON.stringify({ receivedAt: new Date().toISOString(), event: data }) + '\n';
      await fs.promises.appendFile(filePath, line, 'utf8');
    } catch (err) {
      console.error('[Analytics] Failed to append to analytics.log', err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Analytics] Error handling POST request', err);
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
