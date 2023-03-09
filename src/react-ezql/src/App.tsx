import './App.css'
import EzqlPrompt from './components/ezql-prompt'
import { useEffect, useState } from 'react'

const TRIGGERS = ['KeyK', 'Slash']

function App() {
  const [shouldDisplayEzql, setShouldDisplayEzql] = useState(false)
  const [token, setToken] = useState<string>('')

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
      <p className="text-center text-gray-400 my-2">
        Press <i>Command-K</i> to display EZQL, <i>Escape</i> to dismiss.
      </p>

      <p className='mx-2 flex items-center'>
        <label>Token</label>
        <input
          className="bg-gray-50 rounded-sm ml-4 border border-gray-200 p-1 flex-1"
          onChange={(event) => setToken(event.target.value)}
        />
      </p>

      {shouldDisplayEzql && (
        <EzqlPrompt
          token={token}
          setShouldDisplayEzql={setShouldDisplayEzql}
          suggestions={suggestions}
          didSubmitWithValue={(_value) => {
            setShouldDisplayEzql(false)
          }}
          onResults={(sql) => console.log(sql)}
          className="optional-for-styling-convenience"
        />
      )}
    </>
  )
}

export default App
