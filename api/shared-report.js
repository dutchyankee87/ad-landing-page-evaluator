// API endpoint to retrieve shared reports
// GET /api/shared-report/:shareToken

import { getSharedReport, incrementShareView } from '../src/lib/db/queries.js';
import { isValidShareToken, isExpired } from '../src/utils/shareUtils.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { shareToken } = req.query;

    if (!shareToken || !isValidShareToken(shareToken)) {
      return res.status(400).json({ error: 'Invalid share token' });
    }

    // Get shared report from database
    try {
      const sharedReport = await getSharedReport(shareToken);
      
      if (!sharedReport) {
        return res.status(404).json({ error: 'Shared report not found' });
      }

      // Check if expired
      if (isExpired(new Date(sharedReport.expiresAt))) {
        return res.status(410).json({ error: 'Shared report has expired' });
      }

      // Increment view count
      await incrementShareView(shareToken);

      return res.status(200).json({
        success: true,
        data: {
          shareToken: sharedReport.shareToken,
          title: sharedReport.title,
          sanitizedData: sharedReport.sanitizedData,
          expiresAt: sharedReport.expiresAt,
          viewCount: sharedReport.viewCount + 1, // Return incremented count
          lastViewedAt: new Date().toISOString(),
          createdAt: sharedReport.createdAt
        }
      });

    } catch (dbError) {
      console.error('Database fetch failed:', dbError.message);
      return res.status(503).json({ 
        error: 'Service temporarily unavailable. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

  } catch (error) {
    console.error('Error fetching shared report:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch shared report',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}