import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';

import Home from './layouts/Home';

import theme from './theme';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/new' render={() => <Redirect to="/" />} />
            <Route exact path='/tournament' render={() => <Redirect to="/" />} />
            <Route path='/tournament/:id' render={() => <Redirect to="/" />} />
            <Route path='/settings' render={() => <Redirect to="/" />} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
