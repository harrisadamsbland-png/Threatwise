import { expect, it } from 'vitest'
import { INBOX_EMAILS } from '../../src/content/inbox'
import { MODULES } from '../../src/content/modules'
import { validateContent } from '../../src/content/validate'

it('shipped content passes validation', () => {
  expect(validateContent(MODULES, INBOX_EMAILS)).toEqual([])
})
