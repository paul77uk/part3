import Note from './components/Note'
import { useState, useEffect } from 'react'
import noteService from './services/notes'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className="error">{message}</div>
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2023
      </em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  // const hook = () => {
  //   console.log('effect')
  //   axios.get('http://localhost:3001/notes').then((response) => {
  //     console.log('promise fulfilled')
  //     setNotes(response.data)
  //   })
  // }

  // By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.
  // The second parameter of useEffect is used to specify how often the effect is run. If the second parameter is an empty array [], then the effect is only run along with the first render of the component.

  // useEffect(hook, [])
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])
   // do not render anything if notes is still null
  if (!notes) {
    return null
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((n) => n.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
