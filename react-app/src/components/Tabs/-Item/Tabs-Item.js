import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

export default class TabsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  

  render() {
    const { isActive, hasDropdown, title, items } = this.props;
    const cnTabsItem = cn('Tabs', 'Item');

    if (isDropdown) {
      this.state.isDropdownShown = false;
    }

    return (
      <li className={cnTabsItem({ isActive })}>
        {title}
        {
          isDropdown ?
            (
              <Icon
                type='arrow'
                position={this.state.hasDropdown ? 'pointUp' : 'pointDown'}
              />
            ) : ''
        }
      </li>
    )
  }
}