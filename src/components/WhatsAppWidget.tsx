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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <p className="text-sm font-medium text-gray-900">Share AdAlign with colleagues</p>
            <p className="text-xs text-gray-600">Help others optimize their ad campaigns</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleWhatsAppShare}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 touch-manipulation flex items-center space-x-2"
            >
              <span>Share</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 touch-manipulation"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[9999]">
        <div className="relative max-w-md mx-auto">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg backdrop-blur-sm p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <p className="text-white font-medium text-sm">Share AdAlign with your network</p>
                <p className="text-green-100 text-xs mt-1">Help marketers optimize their campaigns</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleWhatsAppShare}
                  className="bg-white text-green-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-green-50 hover:scale-105 flex items-center space-x-2 shadow-sm"
                >
                  <span>Share via WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-2 text-green-100 hover:text-white transition-colors duration-200 hover:bg-green-400 rounded-lg"
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