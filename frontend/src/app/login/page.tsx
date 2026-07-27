"use client";
import React, { useState } from "react";
import { Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { user_service } from "@/context/AppContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Animation Variants
const containerVariants : Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1 
    }
  }
};

const childVariants : Variants  = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${user_service}/api/v1/user/login`, { email });
      // toast.success(data.message);
      router.push(`/verify?email=${email}`);
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md z-10"
      >
        <div className="bg-slate-800/40 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-slate-700/50">
          <div className="text-center mb-10">
            <motion.div 
              variants={childVariants}
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20"
            >
              <Mail size={40} className="text-white" />
            </motion.div>
            
            <motion.h1 
              variants={childVariants}
              className="text-4xl font-bold text-white mb-3 tracking-tight"
            >
              Welcome Back
            </motion.h1>
            
            <motion.p 
              variants={childVariants}
              className="text-slate-400 text-lg flex items-center justify-center gap-2"
            >
              Start your journey with AI <Sparkles size={18} className="text-blue-400" />
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={childVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2 ml-1"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail
                    className="text-slate-500 group-focus-within:text-blue-400 transition-colors"
                    size={20}
                  />
                </div>
                <input
                  type="email"
                  id="email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-900/50 text-white border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.button
              variants={childVariants}
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 px-6 rounded-2xl transition-all font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 overflow-hidden relative group"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="tracking-wide">Securely Sending...</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="static"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <span className="tracking-wide">Get Verification Code</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <motion.div 
            variants={childVariants}
            className="mt-8 text-center"
          >
            <p className="text-slate-500 text-sm">
              By continuing, you agree to our terms of service.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;