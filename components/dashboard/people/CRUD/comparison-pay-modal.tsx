"use client";

import { Info, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PeerData {
  full_name: string;
  pay_rate: number;
  pay_type: string;
  employment_type: string; // Added to show Full-time/Intern labels
}

interface ComparisonPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  peers: PeerData[];
}

export function ComparisonPayModal({ isOpen, onClose, roleName, peers }: ComparisonPayModalProps) {
  const displayPeers = peers.slice(0, 5);

  return (
    <AnimatePresence>
      {isOpen && displayPeers.length > 0 && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: typeof window !== 'undefined' && window.innerWidth > 1280 ? 480 : 0 
            }}
            exit={{ opacity: 0, scale: 0.95, x: 40 }}
            className="w-full max-w-[360px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-blue-500/5">
              <div className="flex items-center gap-2 text-blue-400">
                <Info className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Pay Comparison</span>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-md text-zinc-500 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content List */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-zinc-400">
                Peer rates for <span className="text-zinc-100 font-semibold">"{roleName}"</span>:
              </p>
              
              <div className="space-y-2">
                {displayPeers.map((peer, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex flex-col">
                      {/* Label now shows Employment Type (Full-time, Internship, etc.) */}
                      <span className="text-[9px] text-blue-400/80 uppercase font-bold leading-none mb-1">
                        {peer.employment_type}
                      </span>
                      <span className="text-xs font-medium text-zinc-200 truncate max-w-[140px]">
                        {peer.full_name}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] text-zinc-500 uppercase font-bold block leading-none mb-1">Rate</span>
                      <div className="text-sm font-bold text-blue-500">
                        {formatCurrency(peer.pay_rate)}
                        <span className="text-[10px] text-zinc-500 font-normal lowercase ml-1">
                          /{peer.pay_type === 'Monthly' ? 'mo' : 'hr'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-900">
                <p className="text-[9px] text-center text-zinc-600 italic">
                  Showing {displayPeers.length} peer records
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}