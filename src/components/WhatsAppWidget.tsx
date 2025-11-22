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
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-[9999] bg-gradient-to-r from-white via-white to-white shadow-2xl border border-gray-200/50 rounded-2xl px-6 py-3 max-w-lg backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-3">
            <p className="text-sm font-medium text-gray-900">Help others align their ads and landing pages</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleWhatsAppShare}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation flex items-center space-x-1.5 shadow-md"
            >
              <span>Share</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999]">
        <div className="relative max-w-lg mx-auto">
          <div className="bg-gradient-to-r from-white via-white to-white shadow-2xl border border-gray-200/50 rounded-2xl px-8 py-3 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <p className="text-sm font-medium text-gray-900">Help others align their ads and landing pages</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleWhatsAppShare}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1.5 shadow-md"
                >
                  <span>Share</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}