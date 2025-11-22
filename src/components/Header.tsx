import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, BookOpen, CreditCard, Menu, X, Zap, User, LogOut } from 'lucide-react';
import { useAuth, useUser, SignInButton, UserButton } from '@clerk/clerk-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  
  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <BarChart3 className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent">
                ADalign.io
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/articles" 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                  location.pathname === '/articles' || location.pathname.startsWith('/articles/')
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Articles</span>
              </Link>
            </motion.div>
            

            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link 
                to="/pricing" 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                  location.pathname === '/pricing'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span className="font-medium">Pricing</span>
              </Link>
            </motion.div>

            {/* User Authentication */}
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <motion.div 
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]}
                  </span>
                </motion.div>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "shadow-lg border border-gray-200",
                    }
                  }}
                  showName={false}
                />
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <SignInButton mode="modal">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-300">
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </button>
                </SignInButton>
              </motion.div>
            )}
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/evaluate" 
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg ${
                  location.pathname === '/evaluate' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/30 border border-orange-300' 
                    : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-orange-600/20 hover:shadow-xl'
                }`}
              >
                <Zap className="h-4 w-4" />
                <span>Start Analysis</span>
              </Link>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
            >
              <div className="py-4 space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link 
                    to="/articles" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location.pathname === '/articles' || location.pathname.startsWith('/articles/')
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Articles</span>
                  </Link>
                </motion.div>
                

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Link 
                    to="/pricing" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location.pathname === '/pricing'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Pricing</span>
                  </Link>
                </motion.div>
                
                {/* Mobile User Authentication */}
                {isSignedIn ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="px-4 py-3 bg-gray-50 rounded-xl border-l-4 border-blue-500"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]}
                        </span>
                      </div>
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-7 h-7",
                            userButtonPopoverCard: "shadow-lg border border-gray-200",
                          }
                        }}
                        showName={false}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <SignInButton mode="modal">
                      <button 
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Sign In</span>
                      </button>
                    </SignInButton>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link 
                    to="/evaluate" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      location.pathname === '/evaluate' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-md'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Zap className="h-4 w-4" />
                    <span>Start Analysis</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;