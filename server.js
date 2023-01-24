const express = require('express')
const fs = require('fs')
const crypto = require('crypto');
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())

app.get('/notes', (req, res) => {
  // send notes.html file in the public folder
  res.sendFile(__dirname + '/public/notes.html')
})

// * `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
  // read json from the db file
  const data = fs.readFileSync(__dirname + '/db/db.json', 'utf8')
  // parse the json data
  const notes = JSON.parse(data)
  res.json(notes)
})

// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
// You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {
  // read json from the db file
  const data = fs.readFileSync(__dirname + '/db/db.json')
  // parse the json data
  const notes = JSON.parse(data)
  // add a unique id to the note
  const id = crypto.randomBytes(16).toString("hex");
  const note = { id, ...req.body }
  // add the new note to the notes array
  notes.push(note)
  // write the new notes array to the db file
  fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(notes))
  // send the new note back to the client
  res.json(note)
})

// delete a note
app.delete('/api/notes/:id', (req, res) => {
  // read json from the db file
  const data = fs.readFileSync(__dirname + '/db/db.json')
  // parse the json data
  const notes = JSON.parse(data)
  // filter out the note with the id that matches the id in the url
  const newNotes = notes.filter(note => note.id !== req.params.id)
  // write the new notes array to the db file
  fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(newNotes))
  // send the new notes array back to the client
  res.json(newNotes)
})

// send the index.html file in the public folder
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})