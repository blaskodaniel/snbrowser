import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import { ContentList, ContentListProps } from '@sensenet/list-controls-react'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FolderIcon from '@material-ui/icons/Folder'
import DeleteIcon from '@material-ui/icons/Delete'
import { GenericContent, SchemaStore } from '@sensenet/default-content-types'

export interface ContentListDocState extends ContentListProps<GenericContent> {
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
  }),
)

function generate(element: React.ReactElement) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  )
}

const MainPanel: React.FunctionComponent = () => {
  const state: ContentListDocState = {
    items: [
      { Id: 1, Path: '/Root/Examples/Foo', Type: 'Folder', Name: 'Foo', DisplayName: 'FoOoOo', Icon: 'file' },
      { Id: 2, Path: '/Root/Examples/Bar', Type: 'Folder', Name: 'Bar', DisplayName: 'Bár', Icon: 'Settings' },
      { Id: 3, Path: '/Root/Examples/Baz', Type: 'Folder', Name: 'Baz', DisplayName: 'Z Baz', Icon: 'File' },
    ],
    schema: SchemaStore.filter(s => s.ContentTypeName === 'GenericContent')[0],
    selected: [],
    icons: { file: 'insert_drive_file', settings: 'settings' },
    fieldsToDisplay: ['DisplayName', 'Name', 'Type', 'Id'],
    orderBy: 'Id',
    orderDirection: 'asc',
    isEditing: false,
  }
  const classes = useStyles()
  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.title}>
            Documents
          </Typography>
          <div className={classes.demo}>
            <List>
              {generate(
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Single-line item" secondary={'Secondary text'} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="Delete">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>,
              )}
            </List>
          </div>
        </Grid>
        <Grid item xs={12}>
          <ContentList
            displayRowCheckbox={true}
            schema={state.schema}
            selected={state.selected}
            active={state.active}
            items={state.items}
            fieldsToDisplay={['DisplayName']}
            orderBy={'DisplayName'}
            orderDirection={'desc'}
            onRequestSelectionChange={state.onRequestSelectionChange}
            onRequestActiveItemChange={state.onRequestActiveItemChange}
            onRequestActionsMenu={state.onRequestActionsMenu}
            onItemContextMenu={state.onItemContextMenu}
            onRequestOrderChange={state.onRequestOrderChange}
            onItemClick={state.onItemClick}
            onItemDoubleClick={state.onItemDoubleClick}
            checkboxProps={{ color: 'primary' }}
            fieldComponent={state.fieldComponent}
            icons={state.icons}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default MainPanel
