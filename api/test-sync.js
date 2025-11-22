// Manual test endpoint to sync a specific user
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Sync richardson.dillon@gmail.com with a test Clerk ID
    const response = await fetch(`${req.headers.host?.includes('localhost') ? 'http://' : 'https://'}${req.headers.host}/api/sync-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'user_test_richardson', // Test user ID
        email: 'richardson.dillon@gmail.com'
      })
    });

    const result = await response.json();

    return res.status(200).json({
      success: true,
      syncResult: result,
      message: 'Manual sync test completed'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Manual sync test failed'
    });
  }
}