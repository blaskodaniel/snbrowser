import React, { useEffect, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ContentList, ContentListProps } from '@sensenet/list-controls-react'
import Grid from '@material-ui/core/Grid'
import CloudDownload from '@material-ui/icons/CloudDownload'
import OpenInBrowser from '@material-ui/icons/OpenInBrowser'
import Edit from '@material-ui/icons/Edit'
import { File, SchemaStore } from '@sensenet/default-content-types'
import { ConstantContent, ODataCollectionResponse } from '@sensenet/client-core'
import { TableCell } from '@material-ui/core'
import { useRepository } from '../hooks/use-repository'
import { icons } from '../assets/icons'

export interface ContentListDocState extends ContentListProps<File> {
  isEditing: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    actionicon: {
      marginRight: '10px',
    },
  }),
)

const MainPanel: React.FunctionComponent = () => {
  const classes = useStyles()
  const repo: any = useRepository()
  const [data, setData] = useState<File[]>([])

  useEffect(() => {
    async function loadDocuments(): Promise<void> {
      const result: ODataCollectionResponse<File> = await repo.loadCollection({
        path: `${ConstantContent.PORTAL_ROOT.Path}/Content/IT/Document_Library`,
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

      // Fix file unit symbol
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
  }, [repo])

  return (
    <div>
      <Grid container>
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
                  return (
                    <TableCell className="actioncontainer">
                      <CloudDownload className={classes.actionicon} />
                      <OpenInBrowser className={classes.actionicon} />
                      <Edit />
                    </TableCell>
                  )
                // no default
              }
              return null
            }}
            fieldsToDisplay={['DisplayName', 'CreatedBy', 'ModificationDate', 'Size', 'Actions']}
            orderBy={'DisplayName'}
            orderDirection={'asc'}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default MainPanel
