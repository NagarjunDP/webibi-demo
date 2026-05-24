/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LogOut, User, BarChart2 } from "lucide-react";

interface Props {
  phone: string;
  stats: {
    total: number;
    active: number;
    totalOpens: number;
  };
  onLogout: () => void;
}

export default function ProfileTab({ phone, stats, onLogout }: Props) {
  const avgOpens = stats.total > 0 ? (stats.totalOpens / stats.total).toFixed(1) : "0";

  return (
    <div className="pb-24 pt-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col items-center">
        <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <User size={36} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{phone}</h2>
        <p className="text-gray-500 text-sm mt-1">Sales Agent</p>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
        <BarChart2 className="text-primary" /> Your Stats
      </h3>
      
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-50">
            <span className="text-gray-600 font-medium">Total Demos</span>
            <span className="font-bold text-gray-900">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-50">
            <span className="text-gray-600 font-medium">Active Demos</span>
            <span className="font-bold text-gray-900">{stats.active}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-gray-50">
            <span className="text-gray-600 font-medium">Total Opens</span>
            <span className="font-bold text-gray-900">{stats.totalOpens}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Avg Opens per Demo</span>
            <span className="font-bold text-gray-900">{avgOpens}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-xl text-base font-bold hover:bg-red-100 transition-colors"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}
