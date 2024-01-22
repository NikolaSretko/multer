import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../components/shared/Header/Header";
import Footer from "../components/shared/Footer/Footer";

const DetailPage = () => {
    const [post, setPost] = useState(null);
    // useParams-Hook, um die ID aus der URL zu extrahieren
    const { id } = useParams();

    // useEffect-Hook, um den Post beim Laden der Komponente oder Ändern der ID zu laden
    useEffect(() => {
        fetch(`http://localhost:3001/posts`)
            .then(response => response.json())
            .then(posts => {
                // Findet den Post mit der entsprechenden ID
                const foundPost = posts.find(p => p.id === id);
                setPost(foundPost);
            })
            .catch(error => console.error('Error fetching post:', error));
    }, [id]); // Abhängigkeit von der ID, um bei Änderung der ID den Post neu zu laden

    // Anzeige einer Ladeanzeige, wenn der Post noch nicht geladen ist
    if (!post) {
        return <div>Loading...</div>;
    }

    // Vollständige URL für das Bild des Posts
    const fullImageUrl = `http://localhost:3001${post.imageUrl}`;

    return (
        <main className="bg-gray-100">
            <Header />
            <div className="h-64 w-full overflow-hidden">
                <img className="object-cover w-full h-full" src={fullImageUrl} alt={post.title} />
            </div>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
                <h2 className="text-3xl">
                    {post.category}
                </h2>
                <p className="text-gray-700 text-base">
                    {post.content}
                </p>
            </div>
            <Footer />
        </main>
    );
}

export default DetailPage;
