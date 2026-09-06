import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'src', 'lib', 'games', 'config.json');
    const data = fs.readFileSync(configPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ activeGames: [] });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const configPath = path.join(process.cwd(), 'src', 'lib', 'games', 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
