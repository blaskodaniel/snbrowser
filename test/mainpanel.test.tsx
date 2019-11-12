import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import { Repository } from '@sensenet/client-core'
import { RepositoryContext } from '@sensenet/hooks-react'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { ContentList } from '@sensenet/list-controls-react'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import Typography from '@material-ui/core/Typography'
import { CloudDownload, Edit } from '@material-ui/icons'
import Button from '@material-ui/core/Button'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { downloadFile } from '../src/helper'
import MainPanel from '../src/components/mainpanel'
import { TestContentCollection, TestContentCollectionForOrders } from './_mocks_/test_contents'

jest.mock('../src/helper', () => ({
  downloadFile: jest.fn(),
}))

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

  it('should show content list', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MainPanel {...MainPanelProps} />
        </RepositoryContext.Provider>,
      )
    })

    const contentlist = wrapper.update().find(ContentList)
    expect(contentlist).toBeDefined()

    const tablerow = contentlist.find(TableBody).find(TableRow)
    expect(tablerow.length).toEqual(TestContentCollection.length)
  })

  it('should forward to preview location and back again', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MainPanel {...MainPanelProps} />
        </RepositoryContext.Provider>,
      )
    })

    const contentlist = wrapper.update().find(ContentList)
    const tablerow = contentlist.find(TableBody).find(TableRow)

    act(() => {
      ;(tablerow.first().prop('onClick') as any)({ target: { innerHTML: TestContentCollection[0].DisplayName } })
    })

    expect(window.location.pathname).toEqual(`/preview/${TestContentCollection[0].Id}`)

    const backbtn = wrapper.find(Button)
    await act(async () => {
      ;(backbtn.first().prop('onClick') as any)()
    })
    const foldernametitle = wrapper.update().find(Typography)
    expect(foldernametitle.text()).toEqual(`/`)
  })

  it('should open a folder', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MainPanel {...MainPanelProps} />
        </RepositoryContext.Provider>,
      )
    })

    const contentlist = wrapper.update().find(ContentList)
    const tablerow = contentlist.find(TableBody).find(TableRow)

    await act(async () => {
      ;(tablerow.at(1).prop('onDoubleClick') as any)({
        target: { innerHTML: TestContentCollection[1].DisplayName },
      })
    })

    const foldernametitle = wrapper.update().find(Typography)
    expect(foldernametitle.text()).toEqual(`/${TestContentCollection[1].Name}`)
  })

  it('should download a content', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MainPanel {...MainPanelProps} />
        </RepositoryContext.Provider>,
      )
    })

    const downloadicon = wrapper.update().find(CloudDownload)
    act(() => {
      ;(downloadicon.prop('onClick') as any)()
    })

    expect(downloadFile).toBeCalled()
  })

  it('should open edit mode', async () => {
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MainPanel {...MainPanelProps} />
        </RepositoryContext.Provider>,
      )
    })

    const editbtn = wrapper.update().find(Edit)
    act(() => {
      ;(editbtn.first().prop('onClick') as any)({ content: { Id: TestContentCollection[0].Id } })
    })

    expect(window.location.pathname).toEqual(`/edit/${TestContentCollection[0].Id}`)
  })

  it('should order the list', async () => {
    window.fetch = function fetchMethod() {
      return Promise.resolve({ d: TestContentCollectionForOrders } as any)
    }
    repo = new Repository()
    repo.loadCollection = function fetchMethod() {
      return Promise.resolve({ d: { results: TestContentCollectionForOrders } } as any)
    }
    await act(async () => {
      wrapper = mount(
        <RepositoryContext.Provider value={repo}>
          <MainPanel {...MainPanelProps} />
        </RepositoryContext.Provider>,
      )
    })
    const contents = wrapper
      .update()
      .find(ContentList)
      .find('tr')

    expect(contents.at(1).text()).toContain(TestContentCollectionForOrders[0].DisplayName)

    const orderbtn = wrapper.update().find(TableSortLabel)
    act(() => {
      ;(orderbtn.at(0).prop('onClick') as any)()
    })
    const orderedcontents = wrapper
      .update()
      .find(ContentList)
      .find('tr')

    const expectedstring = TestContentCollectionForOrders[0].DisplayName
    expect(orderedcontents.at(1).text()).not.toEqual(expectedstring)
  })
})
