import React, { useState, useEffect } from 'react';
import { Announcement } from '../types.ts';

interface AnnouncementFormProps {
    initialData?: Announcement | null;
    onSubmit: (data: Omit<Announcement, 'id' | 'createdAt'>) => void;
    onCancel: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('タイトルと内容を入力してください。');
            return;
        }
        onSubmit({ title, content });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">{initialData ? 'お知らせを編集' : '新しいお知らせを作成'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">タイトル</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="例: 夏季限定プランのお知らせ"
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">内容</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={5}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="お知らせの詳細な内容を記入してください。"
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        {initialData ? '更新する' : '作成する'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AnnouncementForm;
