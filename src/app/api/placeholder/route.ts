import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const width = searchParams.get('width') || '320';
  const height = searchParams.get('height') || '180';
  const clip = searchParams.get('clip') || '1';

  // Generate a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <circle cx="${parseInt(width)/2}" cy="${parseInt(height)/2}" r="30" fill="white" opacity="0.9"/>
      <polygon points="${parseInt(width)/2-8},${parseInt(height)/2-10} ${parseInt(width)/2-8},${parseInt(height)/2+10} ${parseInt(width)/2+12},${parseInt(height)/2}" fill="#8B5CF6"/>
      <text x="${parseInt(width)/2}" y="${parseInt(height)-20}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Clip ${clip}</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}