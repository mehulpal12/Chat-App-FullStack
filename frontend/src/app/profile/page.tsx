"use client";
import { useAppData, user_service } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loading from '@/components/Loading';
import { ArrowLeftIcon, UserCircle, Edit3, Check, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const { user, isAuth, loading, setUser } = useAppData();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string | undefined>("");
  const router = useRouter();

  const editHandler = () => {
    setIsEdit(!isEdit);
    setName(user?.name);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");
    try {
      const { data } = await axios.post(`${user_service}/api/v1/user/update`, { name }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/"
      });
      toast.success("Name updated successfully");
      setUser(data.user);
      setIsEdit(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    if (!isAuth && !loading) router.push("/login");
  }, [isAuth, loading, router]);

  if (loading) return <Loading />;

  return (
    <div className='min-h-screen bg-[#0f172a] text-white p-4 relative overflow-hidden'>
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-2xl mx-auto pt-12 relative z-10'
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <motion.button 
              whileHover={{ scale: 1.05, x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/chat")} 
              className='bg-slate-800/50 backdrop-blur-md hover:bg-slate-700/50 text-slate-300 p-3 rounded-xl border border-slate-700/50 transition-colors'
            >
              <ArrowLeftIcon size={20} />
            </motion.button>
            <div>
              <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400'>
                Profile Settings
              </h1>
              <p className='text-slate-400 text-sm'>Manage your identity and preferences</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 text-xs font-medium">
            <ShieldCheck size={14} />
            Verified Account
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          
          {/* Profile Header Banner */}
          <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-8 border-b border-slate-700/50">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border-2 border-slate-600/50 shadow-inner"
                >
                  <UserCircle className='w-14 h-14 text-slate-400 group-hover:text-blue-400 transition-colors'/>
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-800 shadow-lg"
                />
              </div>
              <div className="flex-1">
                <motion.h2 layout className='text-2xl font-bold text-white mb-1'>
                  {user?.name || "User"}
                </motion.h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className='text-slate-400 text-sm font-medium uppercase tracking-wider'>Active Now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="space-y-8">
              <motion.div layout className="group">
                <label className='block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4'>
                  Display Name 
                </label>
                
                <AnimatePresence mode="wait">
                  {isEdit ? (
                    <motion.form 
                      key="edit-form"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      onSubmit={submitHandler} 
                      className="flex gap-3"
                    >
                      <input 
                        autoFocus
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                      />
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl shadow-lg shadow-blue-600/20"
                      >
                        <Check size={20} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setIsEdit(false)}
                        className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl"
                      >
                        <X size={20} />
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="display-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/30 border border-transparent group-hover:border-slate-700/50 transition-all"
                    >
                      <span className="text-xl font-medium text-slate-200">
                        {user?.name || "User"}
                      </span>
                      <motion.button 
                        whileHover={{ scale: 1.1, color: '#3b82f6' }}
                        onClick={() => {
                          setName(user?.name);
                          setIsEdit(true);
                        }} 
                        className="text-slate-500 transition-colors p-2"
                      >
                        <Edit3 size={20} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Read-only info for visual balance */}
              <div className="pt-4 border-t border-slate-700/50">
                 <label className='block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2'>
                  Email Address
                </label>
                <p className="text-slate-400">{user?.email || "No email linked"}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-slate-600 text-sm"
        >
          Changes to your display name will be visible to everyone in your chat groups.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ProfilePage;