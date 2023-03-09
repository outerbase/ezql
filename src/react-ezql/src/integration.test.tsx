import { render, screen, cleanup } from '@testing-library/react'
import { describe, expect, test, afterEach } from 'vitest'
import EzqlPrompt from './components/ezql-prompt'

describe('Integration test', () => {
  afterEach(cleanup)

  test('Minimal render display expected text', () => {
    render(<EzqlPrompt onResults={console.dir} setShouldDisplayEzql={() => {}} />)
  })
})
