import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Button, Grid, TableCell } from '@material-ui/core'
import { ArrowBack, CloudDownload, Edit, OpenInBrowser } from '@material-ui/icons'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ContentList, ContentListProps } from '@sensenet/list-controls-react'
import { File, SchemaStore } from '@sensenet/default-content-types'
import { ODataCollectionResponse } from '@sensenet/client-core'
import { useRepository } from '../hooks/use-repository'
import { icons } from '../assets/icons'

export interface ContentListDocState extends ContentListProps<File> {
  isEditing: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    actionicon: {
      marginRight: '10px',
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    iconSmall: {
      fontSize: 20,
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
)

const MainPanel: React.FunctionComponent = () => {
  const classes = useStyles()
  const repo: any = useRepository()
  const [data, setData] = useState<File[]>([])
  const [currentfolder, setCurrentfolder] = useState<string>('')

  useEffect(() => {
    async function loadDocuments(): Promise<void> {
      const result: ODataCollectionResponse<File> = await repo.loadCollection({
        path: `/Root/Content/IT/Document_Library/${currentfolder}`,
        oDataOptions: {
          filter: "ContentType eq 'File' or ContentType eq 'Folder'",
          select: [
            'DisplayName',
            'Description',
            'CreationDate',
            'CreatedBy',
            'ModificationDate',
            'Icon',
            'Type',
            'Id',
            'Path',
            'Name',
            'Size',
            'Actions',
          ] as any,
          orderby: [['ModificationDate', 'desc']],
          expand: ['CreatedBy', 'Actions'] as string[],
        },
      })

      // Fix file size unit symbol
      result.d.results.map(content => {
        if (content.Size !== null && content.Size !== undefined) {
          const fixedsize = content.Size / 1024 / 1024 // convert to MB
          content.Size = parseFloat(fixedsize.toFixed(2))
        }
      })
      setData(result.d.results)
    }

    // Load documents from Repository
    loadDocuments()
  }, [repo, currentfolder])

  const handleDownload = (path: string): void => {
    console.log('Preview: ', path)
  }

  const handleItemClickEvent = (ev: React.SyntheticEvent, content: File): void => {
    const target = ev.target as HTMLElement
    if (content.Type === 'File' && target.innerHTML === (content.DisplayName || content.Name)) {
      handleDownload(content.Path)
    }
  }

  // Handle double click event on folder
  const handleItemDoubleClickEvent = (_ev: React.SyntheticEvent, content: File): void => {
    if (content.Type === 'Folder') {
      setData([])
      setCurrentfolder(content.Name)
    }
  }

  // Handle back to root
  const handleBackEvent = (): void => {
    setData([])
    setCurrentfolder('')
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={12} style={{ display: currentfolder === '' ? 'none' : 'inline-block' }}>
          <Button variant="contained" size="small" className={classes.button} onClick={handleBackEvent}>
            <ArrowBack className={clsx(classes.leftIcon, classes.iconSmall)} />
            Back
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ContentList<File>
            displayRowCheckbox={false}
            schema={SchemaStore.find(s => s.ContentTypeName === 'File') as any}
            selected={[]}
            items={data}
            icons={icons}
            checkboxProps={{ color: 'primary' }}
            fieldComponent={fieldOptions => {
              switch (fieldOptions.field) {
                case 'Actions':
                  if (fieldOptions.content.Type === 'File') {
                    return (
                      <TableCell className="actioncell">
                        <CloudDownload
                          className={classes.actionicon}
                          onClick={() => handleDownload(fieldOptions.content.Path)}
                        />
                        <OpenInBrowser className={classes.actionicon} />
                        <Edit />
                      </TableCell>
                    )
                  } else {
                    return <TableCell className="actioncell"></TableCell>
                  }
                // no default
              }
              return null
            }}
            fieldsToDisplay={['DisplayName', 'CreatedBy', 'ModificationDate', 'Size', 'Actions']}
            orderBy={'DisplayName'}
            onItemClick={handleItemClickEvent}
            onItemDoubleClick={handleItemDoubleClickEvent}
            orderDirection={'asc'}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default MainPanel
