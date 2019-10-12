import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import { default as HorizontalMenuItemComponent } from './-Item/HorizontalMenu-Item';

import './-Ul/HorizontalMenu-Ul.scss';
import './-Icon/_marginLeft/HorizontalMenu-Icon_marginLeft_m.scss';

export interface HorizontalMenuItem {
  title: string;
  hasDropdown: boolean;
  isLoading: boolean;
  items: string[] | undefined,
  isFirstWordHighlighted: boolean,
  isActive: boolean
}

export interface HorizontalMenuProps {
  items: HorizontalMenuItem[];
  height: string;
  iconMargin: string;
  isLoading: boolean;
}

export default class HorizontalMenu extends Component<HorizontalMenuProps> {
  render() {
    const { items, height, iconMargin, isLoading } = this.props;
    const cnHorMenu = cn('HorizontalMenu');

    return (
      <div className={cnHorMenu()}>
        <ul className={cnHorMenu('Ul')}>
          {items.map((item, idx) =>
            <HorizontalMenuItemComponent
              { ...item }
              height={height}
              iconMargin={iconMargin}
              isLoading={isLoading}
              idx={idx}
              key={idx}
            />
          )}
        </ul>
      </div>
    )
  }
}