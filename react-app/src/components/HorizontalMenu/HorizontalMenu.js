import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import HorizontalMenuItem from './-Item/HorizontalMenu-Item';

import './-Ul/HorizontalMenu-Ul.scss';
import './-Icon/_marginLeft/HorizontalMenu-Icon_marginLeft_m.scss';

export default class HorizontalMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { items, height, iconMargin } = this.props;
    const cnHorMenu = cn('HorizontalMenu');

    return (
      <div className={cnHorMenu()}>
        <ul className={cnHorMenu('Ul')}>
          {items.map((item, idx) =>
            <HorizontalMenuItem
              { ...item }
              height={height}
              iconMargin={iconMargin}
              number={idx}
              idx={idx}
              key={idx}
            />
          )}
        </ul>
      </div>
    )
  }
}