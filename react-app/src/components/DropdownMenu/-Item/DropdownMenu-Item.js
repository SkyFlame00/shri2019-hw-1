import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { NavLink } from 'react-router-dom';

import './DropdownMenu-Item.scss';
import '../-Link/DropdownMenu-Link.scss';

export default class DropdownMenuItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title } = this.props;
    const cnDDMenu = cn('DropdownMenu');

    return (
      <li className={cnDDMenu('Item')}>
        <NavLink
          to={`/repos/${title}`}
          className={cnDDMenu('Link')}
        >{title}</NavLink>
      </li>
    )
  }
}