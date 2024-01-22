import React, { useEffect, useState } from 'react';
import GalleryItem from "./GalleryItem";

const GalleryList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/posts')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    return ( 
        <section className="container mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posts.map(post => (
                    <GalleryItem key={post.id} id={post.id} title={post.title} imageUrl={post.imageUrl} content={post.content} />
                ))}
            </div>
        </section>
    );
}

export default GalleryList;
