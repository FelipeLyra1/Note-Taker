const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT  || 3001
const fs = require('fs')
const {v4:uuidv4} = require('uuid')

app.use(express.static('public'))
app.use(express.json())

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    const notes = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8')
    res.send(notes)
})

app.post('/api/notes', (req, res) => {
    console.log('post body', req.body)
    const notesJson = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8')
    const notes = JSON.parse(notesJson)
    req.body.id = uuidv4()
    notes.push(req.body)
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes), 'utf8')
    res.json(req.body)
});

app.delete('/api/notes/:id', (req, res) => {
    console.log('req.params', req.params)
    const notesJson = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8')
    const notes = JSON.parse(notesJson)
    const updatedNotes = notes.filter((note)=> note.id!== req.params.id)
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(updatedNotes), 'utf8')
    res.sendStatus(200)
})



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})