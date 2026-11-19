"use client";
import React, { useState } from 'react';
import styles from '@/styles/blogpost.module.scss';

interface TagsInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
}

/**
 * Chip-style tag editor. Press Enter or comma to add a tag, click the x to remove one.
 * Defined at module level so React keeps the same component (and the input focus) between parent renders.
 */
export default function TagsInput({ tags, onChange }: TagsInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                onChange([...tags, newTag]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className={styles.tagsInput}>
            {tags.map(tag => (
                <div key={tag} className={styles.tagItem}>
                    {tag}
                    <span
                        className={styles.removeTag}
                        onClick={() => removeTag(tag)}
                    >
                        ×
                    </span>
                </div>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tag..."
            />
        </div>
    );
}
