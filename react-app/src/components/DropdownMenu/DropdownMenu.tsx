import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import DropdownMenuItem from './-Item/DropdownMenu-Item';
import Spinner from '../Spinner/Spinner';

import './DropdownMenu.scss';
import './_isShown/DropdownMenu_isShown_yes.scss';
import './_isShown/DropdownMenu_isShown_no.scss';
import './-Ul/DropdownMenu-Ul.scss';
import './-Loading/DropdownMenu-Loading.scss';

export interface DropdownMenuProps {
  items: string[] | undefined;
  isLoading: boolean;
  isShown: boolean;
}

export default class DropdownMenu extends Component<DropdownMenuProps> {
  render() {
    const { items, isLoading, isShown } = this.props;
    const cnDropdownMenu = cn('DropdownMenu')({
      isShown: isShown ? 'yes' : 'no'
    });

    return (
      <div className={cnDropdownMenu}>
        {
          isLoading ?
            <div className={cn('DropdownMenu', 'Loading')()}><Spinner /></div> :
            <ul className={cn('DropdownMenu', 'Ul')()}>
              {items && items.length > 0 ?
                items.map((item, idx) => 
                  <DropdownMenuItem title={item} key={idx} />
                ) :
                'No items provided'
              }
            </ul>
        }
      </div>
    )
  }
}