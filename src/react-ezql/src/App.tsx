import './App.css'
import EzqlPrompt from './components/ezql-prompt'
import { useEffect, useState } from 'react'

const TRIGGERS = ['KeyK', 'Slash']

function App() {
  const [shouldDisplayEzql, setShouldDisplayEzql] = useState(false)
  const suggestions = ['How many books sold last week', 'How many new users signed up today']

  // listen for the trigger to display the modal
  useEffect(() => {
    function ezqlTriggerListener(ev: KeyboardEvent) {
      if (TRIGGERS.includes(ev.code) && ev.getModifierState('Meta')) {
        setShouldDisplayEzql(true)
      }
    }

    // BEGIN listening for the trigger(s)
    document.addEventListener('keydown', ezqlTriggerListener)

    return () => {
      // STOP listening for the trigger(s)
      document.removeEventListener('keydown', ezqlTriggerListener)
    }
  }, [])

  return (
    <>
      <p>
        Press <i>Command-K</i> to display EZQL, <i>Escape</i> to dismiss.
      </p>

      {shouldDisplayEzql && (
        <EzqlPrompt
          setShouldDisplayEzql={setShouldDisplayEzql}
          suggestions={suggestions}
          didSubmitWithValue={(value) => {
            console.log(`query: ${value}`)
            setShouldDisplayEzql(false)
          }}
          onResults={(json) => console.dir(json)}
          className="optional-for-styling-convenience"
        />
      )}
    </>
  )
}

export default App
