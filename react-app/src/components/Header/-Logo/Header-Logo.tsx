import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import Logo from 'components/Logo/Logo';

import './Header-Logo.scss';

export default class HeaderLogo extends Component {
  render() {
    const cnHeaderLogo = cn('Header', 'Logo');

    return (
      <div className={cnHeaderLogo()}>
        <Logo />
      </div>
    )
  }
}