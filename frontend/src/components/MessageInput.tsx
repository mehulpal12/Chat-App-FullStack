import { Paperclip, Send, X, ImageIcon, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageInputProps {
  selectedUser: string | null;
  message: string;
  setMessage: (value: string) => void;
  handleMessageSend: (e: any, imageFile?: File | null) => Promise<void>;
}

const MessageInput = ({ selectedUser, message, setMessage, handleMessageSend }: MessageInputProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;
    
    setIsUploading(true);
    try {
      await handleMessageSend(e, imageFile);
      setImageFile(null);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsUploading(false);
    }
  };

  if (!selectedUser) return null;

  return (
    <div className="p-4 bg-[#0B0E14] border-t border-white/5">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto flex flex-col gap-3">
        
        {/* Image Preview Area */}
        <AnimatePresence>
          {imageFile && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="relative w-fit group"
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-blue-500/30 shadow-lg shadow-blue-500/10">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  className="w-32 h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setImageFile(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-xl border-2 border-[#0B0E14] z-10"
              >
                <X size={14} strokeWidth={3} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Control Area */}
        <div className="flex items-end gap-2 bg-[#1E232B] p-2 rounded-2xl border border-white/5 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
          
          {/* File Upload Button */}
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
          >
            <Paperclip size={22} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  setImageFile(file);
                } else if (file) {
                  toast.error("Please select an image file");
                }
              }}
              className="hidden"
            />
          </motion.label>

          {/* Text Input */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={imageFile ? "Add a caption..." : "Write a message..."}
            className="flex-1 bg-transparent border-none py-3 px-2 text-gray-100 placeholder:text-gray-500 focus:outline-none text-[15px]"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {(message.trim() || imageFile) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isUploading}
                  type="submit"
                  className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[48px]"
                >
                  {isUploading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} fill="currentColor" />
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
      
      {/* Visual background element to tie it into the theme
      <p className="text-[10px] text-center text-gray-600 mt-2 uppercase tracking-widest font-medium">
        Press Enter to send
      </p> */}
    </div>
  );
};

export default MessageInput;