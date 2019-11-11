import { shallow } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import DocviewerComponent from '../src/components/document-viewer'
import { TestContentCollection } from './_mocks_/test_contents'

describe('Document viewer instance', () => {
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
    const props = {
      documentId: TestContentCollection[0].Id.toString(),
    }
    await act(async () => {
      wrapper = shallow(
        <RepositoryContext.Provider value={repo}>
          <DocviewerComponent {...props} />
        </RepositoryContext.Provider>,
      )
    })
    console.log(wrapper.update().debug())

    expect(wrapper.update()).toMatchSnapshot()
  })
})
