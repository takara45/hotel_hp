import React from 'react';
import { PropertyTag, SearchCriteria } from '../types.ts';
import { TAG_DATA } from '../data/tags.ts';

interface SearchByTagProps {
    onSearch: (criteria: SearchCriteria) => void;
}

const SearchByTag: React.FC<SearchByTagProps> = ({ onSearch }) => {
    const tags = Object.values(PropertyTag);

    const handleTagClick = (tag: PropertyTag) => {
        onSearch({ tag });
    };

    return (
        <div className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-stone-700 mb-2">こだわり条件で探す</h2>
            <div className="w-24 h-1 bg-stone-300 mx-auto mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tags.map((tag) => {
                    const tagInfo = TAG_DATA[tag];
                    return (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className="relative aspect-[4/3] rounded-xl overflow-hidden group shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <img src={tagInfo.image} alt={tagInfo.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                            <div className="absolute inset-0 flex items-center justify-center p-2">
                                <span className="text-white text-lg font-bold text-center" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                                    {tagInfo.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchByTag;