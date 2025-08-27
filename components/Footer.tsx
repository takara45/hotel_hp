

import React from 'react';

interface FooterProps {
    onNavigateToAdmin: () => void;
    onNavigateToOwnerLogin: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateToAdmin, onNavigateToOwnerLogin }) => {
  const handleAdminClick = (e: React.MouseEvent) => {
      e.preventDefault();
      onNavigateToAdmin();
  }
  const handleOwnerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigateToOwnerLogin();
  }

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm">&copy; {new Date().getFullYear()} ラストミニッツ・コール. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-indigo-300 transition-colors text-sm">利用規約</a>
            <a href="#" className="hover:text-indigo-300 transition-colors text-sm">プライバシーポリシー</a>
            <a href="#" onClick={handleOwnerClick} className="hover:text-indigo-300 transition-colors text-sm">掲載者様はこちら</a>
            <a href="#" onClick={handleAdminClick} className="hover:text-indigo-300 transition-colors text-sm">管理者用</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;