import React from 'react'
import { Container, CssBaseline, Grid } from '@material-ui/core'
import snLogo from './assets/sensenet_logo_transparent.png'
// import { useCurrentUser } from './hooks/use-current-user'
// import { useRepository } from './hooks/use-repository'
import { NavBarComponent } from './components/navbar'
import MainPanel from './components/mainpanel'

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  // const usr = useCurrentUser()
  // const repo = useRepository()

  return (
    <>
      <CssBaseline />
      <NavBarComponent />
      <Container
        maxWidth="lg"
        style={{
          width: '100%',
          minHeight: '80vh',
          display: 'flex',
          marginTop: '10px',
          verticalAlign: 'middle',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${snLogo})`,
          backgroundSize: 'auto',
        }}>
        <Grid container>
          <Grid item xs={12}>
            <MainPanel />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
