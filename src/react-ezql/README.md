## Installation

```sh
npm install --save-dev react-ezql
```

## Usage

**Minimal usage**

```tsx
import EzqlPrompt from 'react-ezql'

<EzqlPrompt
  setShouldDisplayEzql={setShouldDisplayEzql}
  suggestions={['How many books sold last week', 'How many new users signed up today']}
  didSubmitWithValue={(value) => {
    console.log(`query: ${value}`)
    setShouldDisplayEzql(false)
  }}
  onResults={(json) => console.dir(json)}
  className="optional-for-styling-convenience"
/>
```

**Example App.tsx**
Here lies a demonstration conditionally showing/hiding the prompt

```tsx
import './App.css'
import EzqlPrompt from 'react-ezql'
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
```

## Styling

<!-- TODO? Perhaps we make it possible to utilize CSS variables (when defined) -->

Each HTML Element has been an assigned a meaningful classname that you can style in your own CSS

- Use the web inspector to reveal which class names are assigned to which elements
- You may optionally pass `className` to the component, i.e. `<EzqlPrompt className="arbitrary-value">`. This allows more precise scoping of CSS:

```css
.arbitrary-value.ezql-prompt-modal {
  background-color: black;
}
,
.arbitrary-value .input-container {
  color: white;
}
```
