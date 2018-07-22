import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import amber from '@material-ui/core/colors/amber';

import Home from './layouts/Home';

import api, { APIContext } from './api';

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: amber
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <APIContext.Provider value={api}>
          <BrowserRouter>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/new' render={() => <Redirect to="/" />} />
              <Route exact path='/tournament' render={() => <Redirect to="/" />} />
              <Route path='/tournament/:id' render={() => <Redirect to="/" />} />
              <Route path='/settings' render={() => <Redirect to="/" />} />
            </Switch>
          </BrowserRouter>
        </APIContext.Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
