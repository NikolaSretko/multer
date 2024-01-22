import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../components/shared/Header/Header";
import Footer from "../components/shared/Footer/Footer";

const DetailPage = () => {
    const [post, setPost] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:3001/posts`)
            .then(response => response.json())
            .then(posts => {
                const foundPost = posts.find(p => p.id === id);
                setPost(foundPost);
            })
            .catch(error => console.error('Error fetching post:', error));
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
    }
    const fullImageUrl = `http://localhost:3001${post.imageUrl}`;

    return (
        <main className="bg-gray-100">
            <Header />
            <div className="h-64 w-full overflow-hidden">
                <img className="object-cover w-full h-full" src={fullImageUrl} alt={post.title} />
            </div>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
                <p className="text-gray-700 text-base">
                    {post.content}
                </p>
            </div>
            <Footer />
        </main>
    );
}

export default DetailPage;
