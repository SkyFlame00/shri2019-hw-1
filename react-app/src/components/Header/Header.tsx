import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import HeaderLogo from './-Logo/Header-Logo';
import HeaderMenu from './-Menu/Header-Menu';

import './Header.scss';

export interface HeaderProps {
  isReposReceived: boolean;
  repos: string[] | undefined;
}

export default class Header extends Component<HeaderProps> {
  render() {
    const { isReposReceived, repos } = this.props;
    const cnHeader = cn('Header');

    return (
      <div className={cnHeader()}>
        <HeaderLogo />
        <HeaderMenu
          isReposReceived={isReposReceived}
          repos={repos}
        />
      </div>
    )
  }
}