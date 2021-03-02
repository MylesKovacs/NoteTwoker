const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const { notes } = require('./db/db');

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
return note;
}

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id) [0];
    return result;
}

// function findByIdAndRemove(id, notesArray) {
//     const result = notesArray.filter(note => note.id === id);   
    
//     return result != id;
    
//      result.splice(id);
//      return result;
// }

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/index.html'));
// });

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
        //res.status(200).json({msg: "get id route"})
    } else {
        //res.status(400).json({msg: "get id route error"})
        res.send(404);
    }
});

// app.delete('/api/notes/:id', (req, res) => {
//     const result = findByIdAndRemove(req.params.id, notes); 
//     if (result) {
//         res.json(result);
//         //res.status(200).json({msg: "get id route"})
//     } else {
//         //res.status(400).json({msg: "get id route error"})
//         res.send(404);
//     }
// });

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();

    const note = createNewNote(req.body, notes);
    res.json(note);
});

app.listen(PORT, () => {
    console.log(`API server now live on ${PORT}.`);
});