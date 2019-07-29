import React from 'react'
import { DocumentViewer } from '@sensenet/document-viewer-react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useInjector } from '../hooks/use-injector'
import { useRepository } from '../hooks/use-repository'
import { useSelectionService } from '../hooks/use-selection-service'
import { CurrentContentProvider } from '../context/current-content-provider'
import { getViewerSettings } from '../service/docview-setting'

const DocViewer: React.FunctionComponent<RouteComponentProps<{ documentId: string }>> = props => {
  const documentId = parseInt(props.match.params.documentId, 10)
  const injector = useInjector()
  const repo = useRepository()
  injector.setExplicitInstance(getViewerSettings(repo))
  const selectionService = useSelectionService()

  if (isNaN(documentId)) {
    throw Error(`Invalid document Id: ${documentId}`)
  }
  const hostName = repo.configuration.repositoryUrl

  return (
    <div style={{ overflow: 'hidden', width: '100%', height: '100%', position: 'inherit' }}>
      <CurrentContentProvider idOrPath={documentId} onContentLoaded={c => selectionService.activeContent.setValue(c)}>
        <DocumentViewer documentIdOrPath={documentId} hostName={hostName} />
      </CurrentContentProvider>
    </div>
  )
}

const DocviewerComponent = withRouter(DocViewer)

export default DocviewerComponent
