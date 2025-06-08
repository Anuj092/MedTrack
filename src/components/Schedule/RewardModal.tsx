import React from 'react';
import { Trophy, Star, X } from 'lucide-react';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  message: string;
}

export const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, streak, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        
        <div className="flex items-center justify-center space-x-1 mb-6">
          {[...Array(Math.min(streak, 5))].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
          ))}
          {streak > 5 && (
            <span className="text-lg font-bold text-yellow-500 ml-2">+{streak - 5}</span>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 transition-all"
        >
          Keep Going!
        </button>
      </div>
    </div>
  );
};