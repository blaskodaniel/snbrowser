import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Repository } from '@sensenet/client-core'
import MainPanel from '../src/components/mainpanel'
import { RepositoryContext } from '../src/context/repository-provider'
import { TestContentCollection } from './_mocks_/test_contents'

describe('The main browser panel instance', () => {
  let wrapper: any
  let repo: any

  beforeEach(() => {
    repo = new Repository()
    repo.loadCollection = function fetchMethod() {
      return Promise.resolve({ d: { results: TestContentCollection } } as any)
    }
  })

  it('should renders correctly', () => {
    act(() => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MainPanel />
        </RepositoryContext.Provider>,
      )
    })
    console.log(wrapper.update().html())

    expect(wrapper.update()).toMatchSnapshot()
  })
})
