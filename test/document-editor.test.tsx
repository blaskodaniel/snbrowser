import { shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import EditorPage from '../src/components/document-editor'
import { TestContentCollection } from './_mocks_/test_contents'

describe('Document editor instance', () => {
  let wrapper: any
  let repo: any

  beforeEach(() => {
    window.fetch = function fetchMethod() {
      return Promise.resolve({ d: TestContentCollection } as any)
    }
    repo = new Repository()
    repo.loadCollection = function fetchMethod() {
      return Promise.resolve({ d: { results: TestContentCollection } } as any)
    }
  })

  it('should renders correctly', async () => {
    const editorprops = {
      repository: repo,
      documentId: TestContentCollection[0].Id,
    }
    await act(async () => {
      wrapper = shallow(
        <RepositoryContext.Provider value={repo}>
          <EditorPage repository={repo} {...editorprops} />
        </RepositoryContext.Provider>,
      )
    })

    expect(wrapper.update()).toMatchSnapshot()
  })
})
