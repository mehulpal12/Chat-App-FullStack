import { Chats, User } from '@/context/AppContext';
import { CornerDownRight, CornerUpLeft, LogOut, MessageCircle, Plus, Search, X, Users, Hash } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUsers: boolean;
  setShowAllUsers: (showAllUsers: boolean) => void;
  istyping: boolean;
  typingTimeOut: NodeJS.Timeout | null;
  user: User[] | null;
  chats: Chats[] | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string) => void;
  handlelogout: () => void;
  loggedInUser: User | null;
  createChat: (user: User) => void;
  onlineUsers: string[];
}

// Framer Motion Variants for Staggered Lists
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

const ChatSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  showAllUsers,
  setShowAllUsers,
  istyping,
  typingTimeOut,
  user,
  chats,
  selectedUser,
  setSelectedUser,
  handlelogout,
  loggedInUser,
  createChat,
  onlineUsers
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <aside
      className={`fixed z-30 sm:static top-0 left-0 h-full w-80 bg-[#0B0E14] border-r border-white/5 transform 
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      sm:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl`}
    >
      {/* Header */}
      <div className='p-4 border-b border-white/5'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-blue-500/10'>
              <MessageCircle className='w-5 h-5 text-blue-400' />
            </div>
            <h1 className='text-lg font-semibold tracking-tight text-white'>
              {showAllUsers ? "New Chat" : "Messages"}
            </h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAllUsers(!showAllUsers)}
            className='p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors'
          >
            {showAllUsers ? <X size={20} /> : <Plus size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {showAllUsers ? (
            <motion.div
              key="users-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='flex flex-col h-full p-4 space-y-4'
            >
              <div className="relative group">
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors' size={18} />
                <input
                  type="text"
                  placeholder='Search people...'
                  className='w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-sm'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='flex-1 overflow-y-auto custom-scrollbar space-y-1'
              >
                {user?.filter((u) => u._id !== loggedInUser?._id && u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => (
                  <motion.div
                    key={u._id}
                    variants={itemVariants}
                    onClick={() => createChat(u)}
                    className='flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer group transition-all'
                  >
                    <div className='relative shrink-0'>
                      <div className='w-11 h-11 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center border border-white/10'>
                        <span className='text-white font-medium'>{u.name.charAt(0).toUpperCase()}</span>
                      </div>
                      {onlineUsers.includes(u._id) && (
                        <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B0E14]'></span>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-medium text-gray-200 truncate group-hover:text-white transition-colors'>{u.name}</h3>
                      <p className={`text-xs ${onlineUsers.includes(u._id) ? 'text-green-500/80' : 'text-gray-500'}`}>
                        {onlineUsers.includes(u._id) ? 'Active now' : 'Offline'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chats-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className='h-full overflow-y-auto p-3 space-y-1 custom-scrollbar'
            >
              {chats && chats.length > 0 ? (
                chats.map((chatItem) => {
                  const latestMessage = chatItem.chat.latestMessage;
                  const isSelected = selectedUser === chatItem.chat._id;
                  const isSendByMe = latestMessage?.sender === loggedInUser?._id;
                  const unSeenCount = chatItem.chat.unseenCount;

                  return (
                    <motion.button
                      key={chatItem.chat._id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedUser(chatItem.chat._id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
                        isSelected ? "bg-blue-600/10 border border-blue-500/20" : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className='relative shrink-0'>
                        <div className='w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center border border-white/5'>
                          <span className='text-gray-200 font-semibold'>{(chatItem.user?.name || "U").charAt(0).toUpperCase()}</span>
                        </div>
                        {chatItem.user && onlineUsers.includes(chatItem.user._id) && (
                          <span className='absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0B0E14]'></span>
                        )}
                      </div>
                      
                      <div className='flex-1 min-w-0'>
                        <div className="flex justify-between items-center mb-0.5">
                          <h3 className={`font-semibold text-sm truncate ${isSelected ? "text-blue-400" : "text-gray-200"}`}>
                            {chatItem.user?.name || "Unknown User"}
                          </h3>
                          {unSeenCount && unSeenCount > 0 ? (
                            <span className='bg-blue-500 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center'>
                              {unSeenCount}
                            </span>
                          ) : null}
                        </div>
                        
                        {latestMessage && (
                          <div className='flex items-center gap-1.5 opacity-70'>
                            {isSendByMe ? <CornerUpLeft size={12} className='text-blue-400' /> : <CornerDownRight size={12} className='text-green-400' />}
                            <p className='text-xs text-gray-400 truncate'>{latestMessage.text}</p>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 opacity-40">
                  <div className="p-5 bg-white/5 rounded-full mb-4">
                    <MessageCircle size={40} />
                  </div>
                  <p className='text-lg font-medium'>No messages yet</p>
                  <p className='text-sm'>Your conversations will appear here</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className='p-4 border-t border-white/5 bg-[#0B0E14]/80 backdrop-blur-md'>
        <div className='flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5'>
          <Link href="/profile" className='shrink-0'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20'>
              <span className='text-white font-bold'>{loggedInUser?.name.charAt(0).toUpperCase()}</span>
            </div>
          </Link>
          <div className='flex-1 min-w-0 overflow-hidden'>
            <Link href="/profile">
              <h3 className='text-sm font-semibold text-gray-200 truncate hover:text-blue-400 transition-colors'>{loggedInUser?.name}</h3>
              <p className='text-[11px] text-gray-500 truncate'>{loggedInUser?.email}</p>
            </Link>
          </div>
          <button 
            onClick={handlelogout} 
            className='p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all'
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;