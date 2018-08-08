import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

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
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    minWidth: 275,
    margin: theme.spacing.unit,
  },
  right: {
    marginLeft: 'auto',
  },
});

class PlayerCards extends Component {
  render() {
    const { classes, search, players } = this.props;
    let cards = !search
      ? players
      : players.filter(t => t.name.toLowerCase().includes(search));
    return (
      <div className={classes.root}>
        {cards.map(({id, name, points}) => (
          <Card key={id} id={id} className={classes.card}>
            <CardHeader title={name} />
            <CardContent>
              <Typography>
                {`${points} Cumulative Points`}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size='small'
                className={classes.right}
                href={`/player/${id}`}
              >
                Details
              </Button>
            </CardActions>
          </Card>
        ))}
        {!cards.length && (
          <Card id='not-found' className={classes.card}>
            <CardHeader
              title='No Players Found'
            />
          </Card>
        )}
      </div>
    );
  }
}

PlayerCards.defaultProps = {
  players: [],
  selected: [],
  onSelect: (tournaments) => null,
  search: '',
};

PlayerCards.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  players: PropTypes.array,
  selected: PropTypes.array,
  onSelect: PropTypes.func,
  search: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(PlayerCards);
