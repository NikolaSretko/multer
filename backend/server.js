const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const uuid4 = require('uuid4');
const dotenv = require('dotenv')
const app = express();

// Erlaubt Cross-Origin Resource Sharing, damit deine API von einer Webanwendung aus einer anderen Domain aufgerufen werden kann.
app.use(cors());

// Konfiguration der Umgebungsvariablen
dotenv.config();

// Erlaubt der Express-App, JSON-Daten zu verarbeiten
app.use(express.json());

// Setzt den Port für den Server. Verwendet den Port aus der Umgebungsvariablen oder 3001 als Standard.
const PORT = process.env.PORT || 3001;

// Startet den Server auf dem festgelegten Port
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

// Statuscodes für verschiedene HTTP-Antworten
const OK = 200;
const INTENAL_SERVER_ERROE = 500;
const CREADTED = 201;
const NOT_FOUND = 404;

// Stellt den Ordner 'uploads' öffentlich zur Verfügung, um hochgeladene Dateien zugänglich zu machen
app.use('/uploads', express.static('uploads'));

// Konfiguration von multer für die Dateispeicherung
const storage = multer.diskStorage({
    // Definiert den Speicherort für die hochgeladenen Dateien
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    // Definiert den Dateinamen für die hochgeladenen Dateien
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const upload = multer({ storage: storage });

// Funktion zum Lesen und Filtern von Posts aus einer JSON-Datei
function getPosts(filters = {}) {
    return fs.readFile('data.json', 'utf8')
        .then(data => {
            let posts = JSON.parse(data);

            // Filtert Posts basierend auf den übergebenen Filterkriterien
            return posts.filter(post => {
                return Object.entries(filters).every(([key, value]) => {
                    if (!post[key]) return false;
                    return post[key].toLowerCase().includes(value.toLowerCase());
                });
            });
        })
        .catch(error => {
            console.error('Error reading from data.json:', error);
            throw error;
        });
}

// Route zum Abrufen von Posts mit optionalen Filtern
app.get('/posts', (req, res) => {
    const filters = req.query;

    getPosts(filters)
        .then(posts => res.json(posts))
        .catch(() => res.status(INTERNAL_SERVER_ERROR).send('Error fetching the posts'));
});

// Route zum Abrufen aller Posts
app.get('/posts', (_, res) => {
    getPosts()
        .then(posts => res.json(posts))
        .catch(() => res.status(INTENAL_SERVER_ERROE).send('Error fetching the posts'));
});

// Route zum Erstellen eines neuen Posts mit einem Bild
app.post('/posts', upload.single('image'), (req, res) => {
    getPosts()
        .then(posts => {
            // Erstellt ein neues Post-Objekt
            const newPost = {
                id: uuid4(),
                category: req.body.category,
                title: req.body.title,
                content: req.body.content,
                imageUrl: req.file ? `/uploads/${req.file.filename}` : null
            };

            // Fügt das neue Post den bestehenden Posts hinzu
            posts.push(newPost);

            // Speichert die aktualisierte Post-Liste in die Datei
            return fs.writeFile('data.json', JSON.stringify(posts, null, 2), 'utf8').then(() => newPost);
        })
        .then(newPost => res.status(CREADTED).json(newPost))
        .catch(error => {
            console.error('Error writing to data.json:', error);
            res.status(INTENAL_SERVER_ERROE).send('Error saving the post');
        });
});

// Route-Handler für nicht gefundene Endpunkte
app.use((_, res) => {
    res.status(NOT_FOUND).json({
        success: false,
        error: "Route not found",
    });
});
