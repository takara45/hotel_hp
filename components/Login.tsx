
import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const HARDCODED_PASSWORD = 'password123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === HARDCODED_PASSWORD) {
      setError('');
      onLoginSuccess();
    } else {
      setError('パスワードが違います。');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <main className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg animate-fade-in">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">管理者ログイン</h2>
            <p className="mt-2 text-sm text-gray-600">アクセスするにはパスワードを入力してください。</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
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

export default Login;
