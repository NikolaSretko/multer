import React, { useEffect, useState } from 'react';
import GalleryItem from "./GalleryItem";

const GalleryList = () => {
    // useState-Hooks für die Verwaltung des Zustands der Posts, des Suchbegriffs und der Kategorie
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');

    // useEffect-Hook, um Posts beim ersten Rendern der Komponente zu laden
    useEffect(() => {
        fetchPosts();
    }, []);

    // Funktion, um Posts von einem Server zu holen, optional mit einem Suchbegriff
    const fetchPosts = (query = '') => {
        fetch(`http://localhost:3001/posts${query}`)
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
    };

    // Handler-Funktion für die Suchfunktion
    const handleSearch = () => {
        const query = `?title=${searchTerm}`;
        fetchPosts(query);
    };

    // Handler-Funktion für die Änderung der Kategorie
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        const query = e.target.value ? `?category=${e.target.value}` : '';
        fetchPosts(query);
    };

    return ( 
        // Hauptcontainer für die Galerie
        <section className="container mx-auto p-4">
            {/* Suchfeld */}
            <div className="mb-4">
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Suche nach Titel"
                />
                <button onClick={handleSearch}>Suchen</button>
            </div>
            {/* Dropdown-Menü für Kategorien */}
            <div className="mb-4">
                <select 
                    value={category} 
                    onChange={handleCategoryChange}
                >
                    <option value="">Alle Kategorien</option>
                    <option value="urlaub">Urlaub</option>
                    <option value="arbeit">Arbeit</option>
                    <option value="freizeit">Freizeit</option>
                </select>
            </div>
            {/* Anzeige der Posts in einem responsiven Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posts.map(post => (
                    <GalleryItem key={post.id} {...post} />
                ))}
            </div>
        </section>
    );
}

export default GalleryList;
