import { User } from '@/context/AppContext';
import { Menu, UserCircle, } from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isTyping: boolean;
  selectedUser: string | null;
  onlineUsers: string[];
}

const ChatHeader = ({ user, setSidebarOpen, isTyping, selectedUser, onlineUsers }: ChatHeaderProps) => {
  const isOnline = user && onlineUsers.includes(user._id);

  return (
    <>
      {/* Mobile toggle button - Refined positioning and blur */}
      <div className='sm:hidden fixed top-4 right-4 z-40'>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className='bg-gray-800/80 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white p-2.5 rounded-xl shadow-lg'
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          <Menu className='w-5 h-5' />
        </motion.button>
      </div>

      {/* Header content - Glassmorphism look */}
      <header className='px-6 py-4 border-b border-white/5 bg-[#0B0E14]/60 backdrop-blur-xl sticky top-0 z-20'>
        <div className='flex items-center justify-between'>
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className='flex items-center gap-4'
              >
                {/* Avatar Section */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10 shadow-inner">
                    <span className='text-white font-bold text-lg'>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  {isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#0B0E14]">
                      <span className='absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75'></span>
                    </div>
                  )}
                </div>

                {/* User Info Section */}
                <div className="flex flex-col">
                  <h3 className='font-semibold text-gray-100 tracking-tight leading-tight'>
                    {user.name}
                  </h3>
                  
                  <div className="flex items-center h-5">
                    <AnimatePresence mode="wait">
                      {isTyping ? (
                        <motion.div
                          key="typing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='flex items-center gap-1.5'
                        >
                          <div className="flex gap-1">
                            {[0, 0.1, 0.2].map((delay) => (
                              <motion.span
                                key={delay}
                                animate={{ y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay }}
                                className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                              />
                            ))}
                          </div>
                          <span className='text-xs font-medium text-blue-400/90'>typing...</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="status"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='flex items-center gap-1.5'
                        >
                          <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`} />
                          <span className='text-xs font-medium text-gray-400'>
                            {isOnline ? "Online" : "Offline"}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-800/50 flex items-center justify-center border border-dashed border-white/20">
                  <UserCircle className='w-7 h-7 text-gray-500' />
                </div>
                <div>
                  <h3 className='font-medium text-gray-300'>Select a conversation</h3>
                  <p className='text-xs text-gray-500'>Choose a chat to start messaging</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};

export default ChatHeader;