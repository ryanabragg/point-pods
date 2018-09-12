import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
  hideOnPrint: {
    '@media print': {
      display: 'none',
    },
  },
});

class SwipeTabControl extends Component {
  state = {
    tabIndex: this.props.goToTab || 0,
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.goToTab !== this.props.goToTab)
      this.handleChangeIndex(this.props.goToTab || 0);
  }

  handleChange = (event, value) => {
    this.setState({ tabIndex: value });
    this.props.onChange(value);
    if(this.props.scrollToTop)
      window.scroll(0, 0);
  };

  handleChangeIndex = (index) => {
    this.setState({ tabIndex: index });
    this.props.onChange(index);
    if(this.props.scrollToTop)
      window.scroll(0, 0);
  };

  render() {
    const {
      children,
      classes,
      theme,
      tabs,
      color,
      tabsOnBottom,
      hideTabsOnPrint,
      animateHeight,
      className
    } = this.props;
    const { tabIndex } = this.state;

    const tabBar = (
      <Tabs
        value={tabIndex}
        onChange={this.handleChange}
        indicatorColor={color}
        textColor={color}
        fullWidth centered
        className={classNames(classes.tabBar, hideTabsOnPrint ? classes.hideOnPrint : null)}
      >
        {tabs.map(tab => (
          <Tab key={tab.key} id={tab.key} label={tab.label} icon={tab.icon} />
        ))}
      </Tabs>
    );

    return (
      <div className={classNames(classes.root, className)}>
        {!tabsOnBottom && tabBar}
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabIndex}
          onChangeIndex={this.handleChangeIndex}
          animateHeight={animateHeight}
        >
          {children || tabs.map((t, i) => <div key={t.key}>{t.label}</div>)}
        </SwipeableViews>
        {tabsOnBottom && tabBar}
      </div>
    );
  }
}

SwipeTabControl.defaultProps = {
  tabs: [],
  goToTab: 0,
  onChange: tabIndex => {},
  color: 'primary',
  tabsOnBottom: true,
  hideTabsOnPrint: false,
  scrollToTop: true,
  animateHeight: false,
  className: '',
};

SwipeTabControl.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  theme: PropTypes.object.isRequired, // added by withStyles
  tabs: PropTypes.array.isRequired,
  goToTab: PropTypes.number,
  onChange: PropTypes.func,
  color: PropTypes.string,
  tabsOnBottom: PropTypes.bool,
  hideTabsOnPrint: PropTypes.bool,
  scrollToTop: PropTypes.bool,
  animateHeight: PropTypes.bool,
  className: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(SwipeTabControl);
