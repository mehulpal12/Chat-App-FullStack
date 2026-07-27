import { Message } from '@/app/chat/page';
import { User } from '@/context/AppContext';
import React, { useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import { Check, CheckCheck, MessageSquareDashed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessagesProps {
  selectedUser: string | null;
  messages: Message[] | null;
  loggedInUser: User | null;
}

const ChatMessages = ({ selectedUser, messages, loggedInUser }: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const uniqueMessages = useMemo(() => {
    if (!messages) return [];
    const seen = new Set();
    return messages.filter((message) => {
      const duplicate = seen.has(message._id);
      seen.add(message._id);
      return !duplicate;
    });
  }, [messages]);

  useEffect(() => {
    const scrollToBottom = () => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    // Small delay to ensure DOM has rendered the new motion elements
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [selectedUser, uniqueMessages]);

  return (
    <div className='flex-1 overflow-hidden bg-[#0B0E14] relative'>
      {/* Subtle Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent pointer-events-none" />

      <div className="h-full overflow-y-auto px-4 py-6 space-y-6 custom-scroll">
        <AnimatePresence initial={false}>
          {!selectedUser ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40"
            >
              <div className="p-6 bg-white/5 rounded-full">
                <MessageSquareDashed size={48} className="text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-200">Your Messages</h3>
                <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Select a contact from the sidebar to start a conversation</p>
              </div>
            </motion.div>
          ) : (
            <>
              {uniqueMessages.map((e, i) => {
                const isSendByMe = e.sender === loggedInUser?._id;
                const uniqueKey = `${e._id}-${i}`;

                return (
                  <motion.div
                    key={uniqueKey}
                    layout
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 25 
                    }}
                    className={`flex flex-col ${isSendByMe ? "items-end" : "items-start"}`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`relative max-w-[75%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl shadow-sm ${
                        isSendByMe
                          ? "bg-blue-600 text-white rounded-tr-none shadow-blue-500/10"
                          : "bg-[#1E232B] text-gray-100 rounded-tl-none border border-white/5"
                      }`}
                    >
                      {e.messageType === 'image' && e.image && (
                        <div className="mb-2 relative group overflow-hidden rounded-lg">
                          <img 
                            src={e.image.url} 
                            alt={e.text || "Sent image"} 
                            className='w-full h-auto object-cover max-w-sm transition-transform duration-500 group-hover:scale-105' 
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>
                      )}
                      
                      {e.text && (
                        <p className='text-[15px] leading-relaxed break-words font-normal'>
                          {e.text}
                        </p>
                      )}
                    </div>

                    {/* Metadata (Time & Status) */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center mt-1.5 gap-1.5 text-[10px] font-medium tracking-wide uppercase ${
                        isSendByMe ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      <span>{moment(e.createdAt).format("hh:mm A")}</span>
                      {isSendByMe && (
                        <div className="flex items-center">
                          {e.seen ? (
                            <CheckCheck className='w-3.5 h-3.5 text-blue-400' strokeWidth={3} />
                          ) : (
                            <Check className='w-3.5 h-3.5 text-gray-600' strokeWidth={3} />
                          )}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
              <div ref={bottomRef} className="h-2 w-full" />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatMessages;