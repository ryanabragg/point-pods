import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';

import Notification, { withNotification } from './components/Notification';
import Home from './layouts/Home';
import NewTournament from './layouts/NewTournament';
import TournamentList from './layouts/TournamentList';
import PlayerList from './layouts/PlayerList';
import Settings from './layouts/Settings';

import theme from './theme';

const NotifiedTournamentList = withNotification(TournamentList);
const NotifiedPlayerList = withNotification(PlayerList);
const NotifiedSettings = withNotification(Settings);

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Notification>
          <BrowserRouter>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/new/:id' component={NewTournament} />
              <Route path='/new' component={NewTournament} />
              <Route path='/tournaments' component={NotifiedTournamentList} />
              <Route path='/tournament/:id' render={() => <Redirect to="/" />} />
              <Route path='/players' component={NotifiedPlayerList} />
              <Route path='/player/:id' render={() => <Redirect to="/" />} />
              <Route path='/settings' component={NotifiedSettings} />
            </Switch>
          </BrowserRouter>
        </Notification>
      </MuiThemeProvider>
    );
  }
}

export default App;
