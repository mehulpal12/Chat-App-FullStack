"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const Loading = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='flex flex-col items-center justify-center fixed inset-0 bg-[#0B0E14] z-[100] min-h-screen'
    >
      <div className='relative flex flex-col items-center gap-6'>
        {/* Main Animated Logo/Spinner */}
        <div className="relative">
          {/* Outer Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className='h-20 w-20 border-2 border-blue-500/20 border-t-blue-500 rounded-full'
          />
          
          {/* Inner Pulsing Icon */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </motion.div>
        </div>

        {/* Loading Text & Animated Dots */}
        <div className="flex flex-col items-center gap-2">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-200 font-semibold tracking-widest text-sm uppercase"
          >
            Initializing Chat
          </motion.h2>
          
          <div className="flex gap-1.5">
            {[0, 0.2, 0.4].map((delay) => (
              <motion.span
                key={delay}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: delay,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Subtle background glow */}
      <div className="absolute w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
    </motion.div>
  );
};

export default Loading;