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
    justifyContent: 'flex-start',
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

class TournamentCards extends Component {
  render() {
    const { classes, displayOnly, tournaments, status, category, search } = this.props;
    let cards;
    switch(status) {
      default:
      case 'Show All': cards = tournaments; break;
      case 'Pending': cards = tournaments.filter(t => t.staging); break;
      case 'In Progress': cards = tournaments.filter(t => !t.staging && !t.done); break;
      case 'Incomplete': cards = tournaments.filter(t => !t.done); break;
      case 'Complete': cards = tournaments.filter(t => t.done); break;
    }
    if(category)
      cards = cards.filter(t => t.category == category);
    if(search)
      cards = cards.filter(t => (
        t.name.toLowerCase().includes(search.toLowerCase())
        || t.category.toLowerCase().includes(search.toLowerCase())
        || t.description.toLowerCase().includes(search.toLowerCase())
      ));
    return (
      <div className={classes.root}>
        {cards.map(({id, name, category, done, staging, players}) => (
          <Card key={id} id={id} className={classes.card}>
            <CardHeader
              title={name}
              subheader={category}
            />
            <CardContent>
              <Typography>
                {`${players.length} Total Players`}
              </Typography>
              <Typography>
                {`${players.filter(t => !t.dropped).length} Active Players`}
              </Typography>
            </CardContent>
            {!displayOnly && (
              <CardActions>
                <Button size='small'
                  className={classes.right}
                  href={`/${staging ? 'new' : 'tournament'}/${id}`}
                >
                  {done ? 'Details' : 'Continue'}
                </Button>
              </CardActions>
            )}
          </Card>
        ))}
        {!cards.length && (
          <Card id='not-found' className={classes.card}>
            <CardHeader
              title='No Tournaments Found'
            />
          </Card>
        )}
      </div>
    );
  }
}

TournamentCards.defaultProps = {
  displayOnly: false,
  tournaments: [],
  selected: [],
  onSelect: (tournaments) => null,
  status: 'Show All',
  category: '',
  search: '',
};

TournamentCards.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  displayOnly: PropTypes.bool,
  tournaments: PropTypes.array,
  selected: PropTypes.array,
  onSelect: PropTypes.func,
  status: PropTypes.oneOf([
    'Show All',
    'Pending',
    'In Progress',
    'Incomplete',
    'Complete',
  ]),
  category: PropTypes.string,
  search: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(TournamentCards);
