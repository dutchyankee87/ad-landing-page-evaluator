import { useState, useEffect } from 'react'
import { X, ArrowRight } from 'lucide-react'

export default function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Debug: Log when widget mounts
    console.log('WhatsAppWidget mounted, visible:', isVisible)
  }, [isVisible])

  // WhatsApp share handler
  const handleWhatsAppShare = () => {
    const message = 'Check out this amazing ad optimization tool that helps improve your marketing campaigns! 🚀 AdAlign.io - Optimize your ad-to-landing page congruence'
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    
    // Verify the URL is properly formatted
    console.log('WhatsApp URL:', whatsappUrl)
    
    // Open WhatsApp with error handling
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error opening WhatsApp:', error)
      // Fallback: try to open WhatsApp Web directly
      window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, '_blank', 'noopener,noreferrer')
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Mobile layout */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-md border-t border-gray-200/60 px-4 py-2 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-3">
            <p className="text-sm font-medium text-gray-900">Share ADalign.io</p>
            <p className="text-xs text-gray-600">Help others optimize campaigns</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleWhatsAppShare}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation flex items-center space-x-1.5 shadow-md"
            >
              <span>Share</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200 touch-manipulation"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[9999]">
        <div className="relative max-w-sm mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/60 p-3 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <p className="text-gray-900 font-medium text-sm">Share ADalign.io</p>
                <p className="text-gray-600 text-xs mt-0.5">Help marketers optimize campaigns</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1.5 shadow-md"
                >
                  <span>Share</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 rounded-lg"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}