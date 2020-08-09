// Dependencies
// ===========================================================
const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = 3001

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

// Routes
// ===========================================================
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

// route that sends user to the notes page
app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.get('/api/notes', function (req, res) {
  res.sendFile(path.join(__dirname, 'db/db.json'))
})

app.post('/api/notes', function (req, res) {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', function (
    error,
    response
  ) {
    if (error) {
      console.log(error)
    }
    const note = JSON.parse(response)
    console.log(note)
    const noteRequest = req.body
    const newNoteId = note.length + 1
    const newNote = {
      id: newNoteId,
      title: noteRequest.title,
      text: noteRequest.text
    }
    note.push(newNote)
    res.json(newNote)
    console.log(note)
    fs.writeFile(
      path.join(__dirname, 'db/db.json'),
      JSON.stringify(note, null, 2),
      function (err) {
        if (err) throw err
      }
    )
  })
})

app.delete('/api/notes/:id', function (req, res) {
  const deleteId = req.params.id
  fs.readFile('db/db.json', 'utf8', function (error, response) {
    if (error) {
      console.log(error)
    }
    let note = JSON.parse(response)
    console.log(note)
    if (deleteId <= note.length) {
      res.json(note.splice(deleteId - 1, 1))
      // Reassign ids to notes
      for (let i = 0; i < note.length; i++) {
        note[i].id = i + 1
      }
      fs.writeFile('db.json', JSON.stringify(note, null, 2), function (err) {
        if (err) throw err
      })
    } else {
      res.json(false)
    }
  })
})

// Listener
// ===========================================================
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`)
})
