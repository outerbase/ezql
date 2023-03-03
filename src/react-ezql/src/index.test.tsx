import renderer from 'react-test-renderer'
import { describe, expect, test } from 'vitest'
import EzqlPrompt from './components/ezql-prompt'

describe('EzqlPrompt', () => {
  test('component renders correctly', () => {
    const component = renderer.create(<EzqlPrompt onResults={console.dir} setShouldDisplayEzql={() => {}} />)

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
