

import React, { useState, useEffect } from 'react';
import { Review } from '../types.ts';
import { StarIcon } from './icons/CoreIcons.tsx';

interface ReviewFormProps {
    initialData?: Review | null;
    onSubmit: (reviewData: Omit<Review, 'id'> | Review) => void;
    onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [author, setAuthor] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        if (initialData) {
            setAuthor(initialData.author);
            setRating(initialData.rating);
            setComment(initialData.comment);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!author.trim() || !comment.trim()){
            alert('名前とコメントを入力してください。');
            return;
        }
        
        const reviewData = {
            author,
            rating,
            comment,
        };

        if (initialData) {
            onSubmit({ ...reviewData, id: initialData.id });
        } else {
            onSubmit(reviewData);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">{initialData ? 'レビューを編集' : 'レビューを投稿'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">お名前</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="例: 宿泊ハナコ"
                    />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700">評価</label>
                     <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                <StarIcon
                                    className={`h-7 w-7 cursor-pointer transition-colors ${
                                        (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                />
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">コメント</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows={4}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="施設の感想をお聞かせください。"
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300"
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                        {initialData ? '更新する' : '投稿する'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;