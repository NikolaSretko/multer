import React, { useState } from 'react';
import Header from '../components/shared/Header/Header';

const Admin = () => {
const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [file, setFile] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', file);

    fetch('http://localhost:3001/posts', {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' },
    })
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
        return response.json();
    })
    .then(post => {
        console.log('Post created:', post);
        setMessage('Der Beitrag wurde erfolgreich veröffentlicht!');
      // Reset form
        setTitle('');
        setContent('');
        setFile(null);
    })
    .catch(error => {
        console.error('Error creating post:', error);
        setMessage('Fehler beim Veröffentlichen des Beitrags.');
    })
    .finally(() => {
        setIsSubmitting(false);
    });
};

return (
    <div className="container mx-auto p-4">
        <Header/>
        {message && <p className="text-green-500">{message}</p>}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titel"
                    disabled={isSubmitting}
                />
            </div>
            <div className="mb-6">
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Inhalt"
                    disabled={isSubmitting}
                ></textarea>
            </div>
            <div className="mb-6">
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={isSubmitting}
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={isSubmitting}
                >
                    Veröffentlichen
                </button>
            </div>
        </form>
    </div>
);
};

export default Admin;
