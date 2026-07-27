"use client";
import axios from "axios";
import { ArrowRight, ChevronLeft, Loader2, Lock, Mail } from "lucide-react";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useAppData, user_service } from "@/context/AppContext";
import Loading from "./Loading";
import toast from "react-hot-toast/headless";
import { motion, AnimatePresence } from "framer-motion";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const VeriftyOtp = () => {
  const { isAuth, setIsAuth, setUser, loading: userLoading, fetchChats, fetchUsers } = useAppData();
  const [loading, setLoading] = React.useState<boolean>(false);

  const searchParams = useSearchParams();
  const email: string = searchParams.get("email") || "";

  const [otp, setOtp] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = React.useState<string>("");
  const [resendLoading, setResendLoading] = React.useState<boolean>(false);
  const [timer, setTimer] = React.useState<number>(60);
  const inputrefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLElement>): Promise<void> => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid OTP");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${user_service}/api/v1/user/verify`, {
        email,
        enteredOtp: otpValue,
      });
      toast.success(data.message);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: false, // Set to false for HTTP environments like some AWS setups
        path: "/",
      });
      setOtp(["", "", "", "", "", ""]);
      inputrefs.current[0]?.focus();
      setUser(data.user);
      setIsAuth(true);
      fetchChats();
      fetchUsers();
    } catch (error: any) {
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
    if (timer > 0) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timer, email, router]);

  const handleInputChange = (index: number, value: string): void => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputrefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputrefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const digits = pastedData.filter((char) => /\d/.test(char));
    
    if (digits.length > 0) {
      const newOtp = [...otp];
      digits.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      setError("");
      const nextIndex = digits.length < 6 ? digits.length : 5;
      inputrefs.current[nextIndex]?.focus();
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    setResendLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${user_service}/api/v1/user/login`, { email });
      toast.success(data.message);
      setTimer(60);
    } catch (error: any) {
      setError(error.response?.data?.message || "Resend failed");
    } finally {
      setResendLoading(false);
    }
  };

  if (userLoading) return <Loading />;
  if (isAuth) redirect("/chat");

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,_#1e293b,_#0f172a)] flex items-center justify-center p-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full" />
          
          <div className="text-center mb-8 relative">
            <motion.button
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-0 left-0 p-2 text-slate-400 hover:text-white transition-colors"
              onClick={() => router.back()}
            >
              <ChevronLeft size={24} />
            </motion.button>

            <motion.div 
              variants={itemVariants}
              className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20"
            >
              <Lock size={32} className="text-white" />
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-3xl font-bold text-white mb-2">
              Verify Email
            </motion.h1>
            <motion.p variants={itemVariants} className="text-slate-400 text-sm">
              We've sent a 6-digit code to 
            </motion.p>
            <motion.p variants={itemVariants} className="text-blue-400 font-medium text-sm">
              {email}
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div variants={itemVariants}>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    whileFocus={{ scale: 1.05, borderColor: "#3b82f6" }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    ref={(el) => { inputrefs.current[index] = el; }}
                    className="w-full h-14 text-center text-xl font-bold text-white bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-sm text-center mt-4 bg-red-400/10 py-2 rounded-lg border border-red-400/20"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl transition-all font-semibold shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center border-t border-slate-700/50 pt-6">
            <p className="text-slate-400 text-sm mb-2">Didn't receive a code?</p>
            <AnimatePresence mode="wait">
              {timer > 0 ? (
                <motion.p 
                  key="timer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-slate-500 text-sm font-medium"
                >
                  Resend available in <span className="text-blue-400">{timer}s</span>
                </motion.p>
              ) : (
                <motion.button
                  key="resend"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleResendOtp}
                  className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors flex items-center gap-2 mx-auto"
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VeriftyOtp;