import React, { useState } from 'react';
import { Property } from '../types.ts';

interface OwnerLoginProps {
  properties: Property[];
  onLoginSuccess: (property: Property) => void;
  onCancel: () => void;
}

const OwnerLogin: React.FC<OwnerLoginProps> = ({ properties, onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundProperty = properties.find(
      p => p.ownerUsername === username && p.ownerPassword === password
    );

    if (foundProperty) {
      setError('');
      onLoginSuccess(foundProperty);
    } else {
      setError('ユーザー名またはパスワードが違います。');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <main className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">掲載者様 ログイン</h2>
            <p className="mt-2 text-sm text-gray-600">施設管理用のIDとパスワードでログインしてください。</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">
              ユーザー名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名"
              className="w-full px-3 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              className="w-full px-3 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
             {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              ログイン
            </button>
          </div>
        </form>
         <div className="text-center border-t pt-6">
            <button
                onClick={onCancel}
                className="font-medium text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
            >
                ユーザー画面に戻る
            </button>
        </div>
      </main>
    </div>
  );
};

export default OwnerLogin;
