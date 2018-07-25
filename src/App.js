import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';

import Home from './layouts/Home';
import NewTournament from './layouts/NewTournament';

import theme from './theme';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/new/:id' component={NewTournament} />
            <Route path='/new' component={NewTournament} />
            <Route path='/tournaments' render={() => <Redirect to="/" />} />
            <Route path='/tournament/:id' render={() => <Redirect to="/" />} />
            <Route path='/players' render={() => <Redirect to="/" />} />
            <Route path='/settings' render={() => <Redirect to="/" />} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
