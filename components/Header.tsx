import React from 'react';
import { PhoneIcon } from './icons/CoreIcons.tsx';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <PhoneIcon className="h-6 w-6 text-white" />
            </div>
            <a href="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
              ラストミニッツ・コール
            </a>
          </div>
          <p className="hidden md:block text-sm text-gray-500">
            明日・明後日の宿を電話で予約
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;