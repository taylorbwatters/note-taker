const express = require("express");
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

function getDb() {
    const db = fs.readFileSync("./db/db.json", "utf-8");
    const parsedDb = JSON.parse(db);

    return parsedDb;
}

function overwriteDb(updatedDb) {
    fs.writeFileSync("./db/db.json", JSON.stringify(updatedDb));
}

app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json'));
});

app.post("/api/notes", (req, res) => {
    const newNote = { ...req.body, id: uuidv4() };
    const updatedDb = [...getDb(), newNote];

    overwriteDb(updatedDb);

    res.send(newNote);
});

app.delete("/api/notes/:slug", (req, res) => {
    const noteId = req.params.slug;
    const db = getDb();

    const updatedDb = db.filter((item) => {
        return item.id !== noteId;
    });

    overwriteDb(updatedDb);

    res.sendStatus(200);
});


app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log("app is listening on port " + PORT);
});