import React from 'react'
import ReactDOM from 'react-dom'
import { Reducers, Store } from '@sensenet/redux'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { Repository } from '@sensenet/client-core'
import { Router } from 'react-router-dom'
import './style.css'
import { commentsStateReducer, sensenetDocumentViewerReducer } from '@sensenet/document-viewer-react'
import { App } from './app'
import { RepositoryProvider } from './context/repository-provider'
import history from './utils/browser-history'

/** Initialize the reducers */
const appReducer = combineReducers({
  sensenet: Reducers.sensenet,
  sensenetDocumentViewer: sensenetDocumentViewerReducer,
  comments: commentsStateReducer,
})
type rootStateType = ReturnType<typeof appReducer>

/** Set the repository */
const repository = new Repository({
  repositoryUrl: 'https://dev.demo.sensenet.com',
})

/** Set the redux store */
const storeOptions = {
  repository,
  rootReducer: appReducer,
} as Store.CreateStoreOptions<rootStateType>
const snstore = Store.createSensenetStore(storeOptions)

/**
 * Initialize React
 */
ReactDOM.render(
  /** The RepositoryProvider will display a login form for non-authenticated users */
  <Provider store={snstore}>
    <Router history={history}>
      <RepositoryProvider
        /** You can insert your additional repository settings here */
        sessionLifetime="expiration">
        <App />
      </RepositoryProvider>
    </Router>
  </Provider>,
  document.getElementById('root'),
)
