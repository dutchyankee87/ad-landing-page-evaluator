import React, { useEffect } from 'react';
import { SignUp, useUser } from '@clerk/clerk-react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { user } = useUser();

  // Call onSuccess when user is authenticated
  useEffect(() => {
    if (user && isOpen) {
      onSuccess();
    }
  }, [user, isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get Your Free Ad Analysis
            </h2>
            <p className="text-gray-600">
              Sign up to continue and get 3 free evaluations per month
            </p>
          </div>
          
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-orange-500 hover:bg-orange-600 text-sm normal-case',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
                formFieldInput: 'border-gray-300 focus:border-orange-500 focus:ring-orange-500',
                footerActionLink: 'text-orange-500 hover:text-orange-600'
              },
            }}
            fallbackRedirectUrl="/evaluate"
            forceRedirectUrl="/evaluate"
          />
        </div>
      </div>
    </div>
  );
}