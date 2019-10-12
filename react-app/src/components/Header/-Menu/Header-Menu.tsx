import React, { Component } from 'react';

import HorizontalMenu, { HorizontalMenuItem } from '../../HorizontalMenu/HorizontalMenu';

export interface HeaderMenuProps {
  isReposReceived: boolean;
  repos: string[] | undefined;
}

export default class HeaderMenu extends Component<HeaderMenuProps> {
  render() {
    const { isReposReceived, repos } = this.props;
    const items: HorizontalMenuItem[] = [
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
          isLoading={!isReposReceived}
          height='large'
          iconMargin='m'
        />
      </div>
    )
  }
}