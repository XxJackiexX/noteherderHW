import React, { Component } from 'react'
import './App.css'
import Main from './Main'
import SignIn from './SignIn'
import SignOut from './SignOut'
import base, { auth } from './base'


class App extends Component {
  constructor () {
    super()

    this.state = {
      notes: {},
      uid: null,
      currentNoteId: null,
  }
}

componentWillMount() {
  auth.onAuthStateChanged(
    (user) => {
      if (user) {
        this.authHandler(user)
      } else {
        this.setState({ uid: null })
      }
    }
  )
}

syncNotes = () => {
  this.ref= base.syncState(
    `${this.state.uid}/notes`,
    {
      context: this, 
      state: 'notes',
    }
  )
}

  signedIn = () => {
    return this.state.uid
  }

  authHandler = (user) => {
    this.setState(
      { uid: user.uid },
      this.syncNotes

    )
  }

  signOut = () => {
    auth.signOut().then(
      () => {
        base.removeBinding(this.ref)
        this.setState({ notes:{} })
      }
      )
  }

  saveNote = (note) => {
    if (!note.id) {
      note.id = `note-${Date.now()}`
      this.setCurrentNoteId(note.id)
    }
    const notes = {...this.state.notes} //not part of JS standard
    notes[note.id] = note
    this.setState({ notes })
  }

  removeNote = (note) => {
    const notes = {...this.state.notes}
    notes[note.id] = null
    this.setState({ notes })

  }

  addNote = () => {
    const note = {
      id: null,
      title: '',
      body: '',
    }
    this.saveNote(note)
  }

  setCurrentNoteId = (noteId) => {
    this.setState({ currentNoteId: noteId })
  }

  renderMain = () => {
    const actions = {
      saveNote: this.saveNote,
      removeNote: this.removeNote,
      setCurrentNoteId: this.setCurrentNoteId,
      addNote: this.addNote,
    }

    const noteData = {
      notes: this.state.notes,
      currentNoteId: this.state.currentNoteId, 
    }

    return (
    <div>
      <SignOut signOut={this.signOut} />
      <Main {...noteData} {...actions} />
    </div>
    )
  }

  render() {
    return (
      <div className="App">
        {this.signedIn() ? this.renderMain(): <SignIn /> }
        
      </div>
    );
  }
}



export default App;