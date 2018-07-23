import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { withAPI } from '../api';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  card: {
    minWidth: 275,
  },
  right: {
    marginLeft: 'auto',
  },
});

class TournamentCardList extends Component {
  state = {
    tournaments: [],
  };

  componentDidMount() {
    this.props.api.Tournaments.all()
      .then(list => this.setState({ tournaments: list }))
      .catch(error => console.log(error.message));
  }

  render() {
    const { classes } = this.props;
    const { tournaments } = this.state;
    const cards = this.props.filterByDone
      ? tournaments.filter(t => t.done === this.props.done)
      : tournaments;
    return (
      <div className={classes.root}>
        {cards.map(({id, name, type, players}) => (
          <Card key={id} className={classes.card}>
            <CardHeader
              title={name}
              subheader={type}
            />
            <CardContent>
              <Typography>
                {`${players.length} Total Players`}
              </Typography>
              <Typography>
                {`${players.filter(t => !t.dropped).length} Active Players`}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size='small'
                className={classes.right}
                href={`/tournament/${id}`}
              >
                Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    );
  }
}

TournamentCardList.defaultProps = {
  filterByDone: false,
  done: false,
};

TournamentCardList.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  filterByDone: PropTypes.bool,
  done: PropTypes.bool,
};

export default withStyles(styles, { withTheme: true })(withAPI(TournamentCardList));
