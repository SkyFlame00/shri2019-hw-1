import React, { Component } from 'react';

import HorizontalMenu from '../../HorizontalMenu/HorizontalMenu';

export default class HeaderMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isReposReceived, repos } = this.props;
    const items = [
      {
        title: 'Repository Arc',
        hasDropdown: true,
        isLoading: !isReposReceived,
        items: repos,
        isFirstWordHighlighted: true,
        isActive: true
      }
    ];

    return (
      <div>
        <HorizontalMenu
          items={items}
          isLoading={isReposReceived}
          height='large'
          iconMargin='m'
        />
      </div>
    )
  }
}