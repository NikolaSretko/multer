const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const uuid4 = require('uuid4');



const app = express();
const OK = 200;
const INTENAL_SERVER_ERROE = 500;
const CREADTED = 201;
const NOT_FOUND = 404;

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Extrahiere die Dateiendung und füge sie dem Dateinamen hinzu
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

const upload = multer({ storage: storage });

// Lese die Daten asynchron mit Promises siehe import oben ^
function getPosts() {
    return fs.readFile('data.json', 'utf8')
        .then(data => JSON.parse(data))
        .catch(error => {
            console.error('Error reading from data.json:', error);
            return [];
        });
}

app.get('/posts', (_, res) => {
    getPosts()
        .then(posts => res.json(posts))
        .catch(() => res.status(INTENAL_SERVER_ERROE).send('Error fetching the posts'));
});

app.post('/posts', upload.single('image'), (req, res) => {
    getPosts()
        .then(posts => {
            const newPost = {
                id: uuid4(),
                title: req.body.title,
                content: req.body.content,
                imageUrl: `/uploads/${req.file?.filename}`
            };

            posts.push(newPost);

            return fs.writeFile('data.json', JSON.stringify(posts, null, 2), 'utf8').then(() => newPost);
        })
        .then(newPost => res.status(CREADTED).json(newPost))
        .catch(error => {
            console.error('Error writing to data.json:', error);
            res.status(INTENAL_SERVER_ERROE).send('Error saving the post');
        });
});

// endpoint not found handler
app.use((_, res) => {
    res.status(NOT_FOUND).json({
        success: false,
        error: "Route not found",
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
