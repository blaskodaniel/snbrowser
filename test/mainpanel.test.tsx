import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import MainPanel from '../src/components/mainpanel'
import { TestContentCollection } from './_mocks_/test_contents'

describe('The main browser panel instance', () => {
  let wrapper: any
  let repo: any

  const MainPanelProps = {
    width: 'lg' as Breakpoint,
  }

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
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MainPanel {...MainPanelProps} />
        </RepositoryContext.Provider>,
      )
    })

    expect(wrapper.update()).toMatchSnapshot()
  })

  it.only('should show preview', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MainPanel {...MainPanelProps} />
        </RepositoryContext.Provider>,
      )
    })
    console.log(wrapper.update().debug())
  })
})
