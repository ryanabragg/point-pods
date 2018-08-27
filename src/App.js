import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';

import Notification, { withNotification } from './components/Notification';
import Home from './layouts/Home';
import TournamentList from './layouts/TournamentList';
import Tournament from './layouts/Tournament';
import PlayerList from './layouts/PlayerList';
import Player from './layouts/Player';
import Settings from './layouts/Settings';

import theme from './theme';

const NotifiedHome = withNotification(Home);
const NotifiedTournamentList = withNotification(TournamentList);
const NotifiedTournament = withNotification(Tournament);
const NotifiedPlayerList = withNotification(PlayerList);
const NotifiedPlayer = withNotification(Player);
const NotifiedSettings = withNotification(Settings);

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Notification>
          <BrowserRouter>
            <Switch>
              <Route exact path='/' component={NotifiedHome} />
              <Route path='/tournaments' component={NotifiedTournamentList} />
              <Route path='/tournament/:id' component={NotifiedTournament} />
              <Route path='/players' component={NotifiedPlayerList} />
              <Route path='/player/:id' component={NotifiedPlayer} />
              <Route path='/settings' component={NotifiedSettings} />
            </Switch>
          </BrowserRouter>
        </Notification>
      </MuiThemeProvider>
    );
  }
}

export default App;
