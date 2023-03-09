## Installation

```sh
npm install --save-dev react-ezql
```

## Usage

**Minimal usage**
- `token` is provided from the Outerbase dashboard
- `suggestions` - a list of queries that can be chosen from a list
- `setShouldDisplayEzql` is a setter for toggling whether the modal is displayed; provide a setter that when true will remove the modal from your page
- `didSubmitWithValue` is called when a query has been submitted to the modal _before_ a request has been made to Outerbase
- `onResults` is called with the resulting SQL string or JSON data (depending on the Prompt type specified)
- `className` provides optional styling classes to be added to the modal

```tsx
import EzqlPrompt from 'react-ezql'

<EzqlPrompt
  token={'arbitrary-value-asdf-1234'}
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

## Local development of react-ezql
pnpm is recommended as `npm link` does not work properly (as of 03/09/2023) with regards to `npm link`ing `lib/ezql` to `react-ezql`. Instead, do this from the `react-ezql` directory:

```sh
pnpm install
pnpm link ../../
```

And be sure to have also built your latest changes in `lib/ezql`, i.e.:

```sh
npm run build
```
