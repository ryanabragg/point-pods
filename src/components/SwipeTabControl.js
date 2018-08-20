import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
  root: {
    marginBottom: 42,
  },
  tabBar: {
    zIndex: 2,
    position: 'fixed',
    bottom: 0,
    width: '100vw',
    background: theme.palette.background.default,
  },
});

class TabControl extends Component {
  state = {
    tabIndex: this.props.goToTab || 0,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.goToTab !== this.props.goToTab)
      this.setState({tabIndex: this.props.goToTab || 0});
  }

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
    const { classes, theme, tabs, color, className, children } = this.props;
    const { tabIndex } = this.state;

    return (
      <div className={ClassNames(classes.root, className)}>
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
  goToTab: 0,
  color: 'primary',
  scrollToTop: true,
  className: '',
};

TabControl.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  theme: PropTypes.object.isRequired, // added by withStyles
  tabs: PropTypes.array.isRequired,
  goToTab: PropTypes.number,
  color: PropTypes.string,
  scrollToTop: PropTypes.bool,
  className: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(TabControl);
