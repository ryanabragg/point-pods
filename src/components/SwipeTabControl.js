import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
  root: {
    paddingBottom: 42,
    width: '100%',
    background: theme.palette.background.default,
  },
  tabBar: {
    zIndex: 2,
    position: 'fixed',
    bottom: 0,
    width: '100vw',
  },
});

class TabControl extends Component {
  state = {
    tabIndex: this.props.initialTab || 0,
  };

  handleChange = (event, value) => {
    this.setState({ tabIndex: value });
    if(this.props.scrollToTop)
      window.scroll(0, 0);
  };

  handleChangeIndex = (index) => {
    this.setState({ tabIndex: index });
    if(this.props.scrollToTop)
      window.scroll(0, 0);
  };

  render() {
    const { classes, theme, tabs, color, children } = this.props;
    const { tabIndex } = this.state;

    return (
      <div className={classes.root}>
        <Tabs
          value={tabIndex}
          onChange={this.handleChange}
          indicatorColor={color}
          textColor={color}
          fullWidth centered
          className={classes.tabBar}
        >
          {tabs.map(tab => (
            <Tab key={tab.key} id={tab.key} label={tab.label} icon={tab.icon} />
          ))}
        </Tabs>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabIndex}
          onChangeIndex={this.handleChangeIndex}
        >
          {children || tabs.map((t, i) => <div key={t.key}>{t.label}</div>)}
        </SwipeableViews>
      </div>
    );
  }
}

TabControl.defaultProps = {
  tabs: [],
  initialTab: 0,
  color: 'primary',
  scrollToTop: true,
};

TabControl.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  theme: PropTypes.object.isRequired, // added by withStyles
  tabs: PropTypes.array.isRequired,
  initialTab: PropTypes.number,
  color: PropTypes.string,
  scrollToTop: PropTypes.bool,
};

export default withStyles(styles, { withTheme: true })(TabControl);
