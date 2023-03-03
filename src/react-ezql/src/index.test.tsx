import renderer from 'react-test-renderer'
import { describe, expect, test } from 'vitest'
import EzqlPrompt from './index'

describe('EzqlPrompt', () => {
  test('component renders correctly', () => {
    const component = renderer.create(<EzqlPrompt />)

    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })
})
