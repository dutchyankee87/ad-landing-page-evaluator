import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScreenshotRequest {
  url: string;
  evaluationId?: string;
  waitTime?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  fullPage?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { url, evaluationId, waitTime = 2000, viewportWidth = 1920, viewportHeight = 1080, fullPage = true }: ScreenshotRequest = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate URL format
    let targetUrl: URL
    try {
      targetUrl = new URL(url)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Capturing screenshot for: ${targetUrl.href}`)

    // Use puppeteer via browserless.io service or similar
    // For this example, we'll use a screenshot service API
    const screenshotServiceUrl = 'https://api.htmlcsstoimage.com/v1/image'
    
    const screenshotResponse = await fetch(screenshotServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('HTMLCSSTOIMAGE_API_KEY') || ''}`,
      },
      body: JSON.stringify({
        url: targetUrl.href,
        device_scale_factor: 1,
        viewport_width: viewportWidth,
        viewport_height: viewportHeight,
        full_page: fullPage,
        delay: waitTime,
        selector: null,
        css: '',
        google_fonts: '',
        render_when_ready: false,
      }),
    })

    if (!screenshotResponse.ok) {
      console.error('Screenshot service error:', await screenshotResponse.text())
      
      // Fallback: Generate a simple placeholder image
      return await generatePlaceholderScreenshot(url, supabaseClient, evaluationId)
    }

    const screenshotData = await screenshotResponse.json()
    
    if (!screenshotData.url) {
      throw new Error('No screenshot URL returned from service')
    }

    // Download the screenshot
    const imageResponse = await fetch(screenshotData.url)
    const imageBuffer = await imageResponse.arrayBuffer()
    
    // Generate filename
    const timestamp = Date.now()
    const domain = targetUrl.hostname.replace(/[^a-zA-Z0-9]/g, '-')
    const filename = `screenshot-${domain}-${timestamp}.png`
    const filePath = `full/${filename}`

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('landing-page-screenshots')
      .upload(filePath, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('landing-page-screenshots')
      .getPublicUrl(uploadData.path)

    // Generate above-the-fold screenshot (smaller viewport)
    const aboveFoldResponse = await captureAboveFold(targetUrl.href, supabaseClient, timestamp, domain)

    const result = {
      success: true,
      url: urlData.publicUrl,
      path: uploadData.path,
      filename,
      size: imageBuffer.byteLength,
      aboveFoldUrl: aboveFoldResponse.url,
      metadata: {
        originalUrl: targetUrl.href,
        capturedAt: new Date().toISOString(),
        viewportWidth,
        viewportHeight,
        fullPage,
        waitTime
      }
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Screenshot capture error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Screenshot capture failed',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function captureAboveFold(url: string, supabaseClient: any, timestamp: number, domain: string) {
  try {
    const screenshotServiceUrl = 'https://api.htmlcsstoimage.com/v1/image'
    
    const response = await fetch(screenshotServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('HTMLCSSTOIMAGE_API_KEY') || ''}`,
      },
      body: JSON.stringify({
        url,
        device_scale_factor: 1,
        viewport_width: 1920,
        viewport_height: 1080,
        full_page: false, // Above fold only
        delay: 1000,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      const imageResponse = await fetch(data.url)
      const imageBuffer = await imageResponse.arrayBuffer()
      
      const filename = `above-fold-${domain}-${timestamp}.png`
      const filePath = `above-fold/${filename}`

      const { data: uploadData } = await supabaseClient.storage
        .from('landing-page-screenshots')
        .upload(filePath, imageBuffer, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false
        })

      if (uploadData) {
        const { data: urlData } = supabaseClient.storage
          .from('landing-page-screenshots')
          .getPublicUrl(uploadData.path)
        
        return { url: urlData.publicUrl, path: uploadData.path }
      }
    }
  } catch (error) {
    console.warn('Above-fold screenshot failed:', error)
  }
  
  return { url: null, path: null }
}

async function generatePlaceholderScreenshot(url: string, supabaseClient: any, evaluationId?: string) {
  // Generate a simple placeholder image when screenshot service fails
  const domain = new URL(url).hostname
  
  // Create a simple SVG placeholder
  const svgContent = `
    <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="#6b7280">
        Screenshot Unavailable
      </text>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#9ca3af">
        ${domain}
      </text>
      <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#d1d5db">
        Visit the URL directly to view the landing page
      </text>
    </svg>
  `
  
  const timestamp = Date.now()
  const filename = `placeholder-${domain.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}.svg`
  const filePath = `placeholders/${filename}`
  
  try {
    const { data: uploadData } = await supabaseClient.storage
      .from('landing-page-screenshots')
      .upload(filePath, svgContent, {
        contentType: 'image/svg+xml',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadData) {
      const { data: urlData } = supabaseClient.storage
        .from('landing-page-screenshots')
        .getPublicUrl(uploadData.path)
      
      return new Response(
        JSON.stringify({
          success: true,
          url: urlData.publicUrl,
          path: uploadData.path,
          filename,
          size: svgContent.length,
          isPlaceholder: true,
          metadata: {
            originalUrl: url,
            capturedAt: new Date().toISOString(),
            type: 'placeholder'
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Placeholder generation failed:', error)
  }
  
  return new Response(
    JSON.stringify({ 
      error: 'Screenshot and placeholder generation both failed',
      success: false 
    }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}