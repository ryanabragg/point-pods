import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
});

class MenuButton extends React.Component {
  state = {
    open: false,
  };

  menuAnchor = null;

  handleToggle = () => this.setState(state => ({ open: !state.open }));

  handleClose = event => {
    if(this.menuAnchor.contains(event.target))
      return;
    this.setState({ open: false });
  };

  handleClick = (i) => (event) => {
    if(typeof this.props.menuItems[i].action === 'function')
      this.props.menuItems[i].action();
  }

  render() {
    const { classes, buttonType, buttonProps, buttonContent, menuItems } = this.props;
    const { open } = this.state;
    let TheButton;
    switch(buttonType) {
      default:
      case 'text': TheButton = Button; break;
      case 'icon': TheButton = IconButton; break;
    }

    return (
      <div className={classes.root}>
          <TheButton
            {...buttonProps}
            buttonRef={node => this.menuAnchor = node}
            aria-owns={open ? 'button-menu' : null}
            aria-haspopup='true'
            onClick={this.handleToggle}
          >
            {buttonContent}
          </TheButton>
          <Popper open={open} anchorEl={this.menuAnchor} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id='button-menu'
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList onClick={this.handleClose}>
                      {menuItems.map((item, i) => (
                        <MenuItem key={i}
                          onClick={this.handleClick(i)}
                        >
                          {item.icon && (
                            <ListItemIcon>
                              {item.icon}
                            </ListItemIcon>
                          )}
                          {item.icon
                            ? <ListItemText inset primary={item.label} />
                            : item.label
                          }
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
      </div>
    );
  }
}

MenuButton.defaultProps = {
  buttonType: 'normal',
  buttonContent: 'button',
  buttonProps: {},
  menuItems: [],
}

MenuButton.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  buttonType: PropTypes.oneOf(['normal', 'icon']),
  buttonContent: PropTypes.node,
  buttonProps: PropTypes.object,
  menuItems: PropTypes.array,
};

export default withStyles(styles)(MenuButton);
