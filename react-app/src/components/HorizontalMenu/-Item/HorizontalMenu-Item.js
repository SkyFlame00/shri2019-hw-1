import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import Icon from '../../Icons/Icon/Icon';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';

import './HorizontalMenu-Item.scss';
import './_height/HorizontalMenu-Item_height_large.scss';
import '../-Link/HorizontalMenu-Link.scss';
import '../-Text/HorizontalMenu-Text.scss';
import '../-Text/_height/HorizontalMenu-Text_height_large.scss';
import '../-Link/_height/HorizontalMenu-Link_height_large.scss';
import '../-Text/_isActive/HorizontalMenu-Text_isActive.scss';

const highlightFirstWord = string => {
  const stringArr = string.split(' ');
  return [
    <b>{stringArr[0]}</b>,
    <span>{' ' + stringArr.slice(1).join(' ')}</span>
  ];
}

export default class HorizontalMenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownShown: false
    };
  }

  onClick(e) {
    e.preventDefault();
    this.setState({
      isDropdownShown: !this.state.isDropdownShown
    });
  }

  render() {
    const {
      isAsync,
      hasDropdown,
      title,
      isLoading,
      items,
      height,
      iconMargin,
      isFirstWordHighlighted,
      isActive,
      idx
    } = this.props;

    const cnIcon = cn('HorizontalMenu', 'Icon')({
      marginLeft: iconMargin || 'm'
    });

    return (
      <li key={idx} className={cn('HorizontalMenu', 'Item')({ height: height || 'large' })}>
        <a
          href='#'
          className={cn('HorizontalMenu', 'Link')({ height: height || 'large' })}
          onClick={this.onClick.bind(this)}
        >
          <div className={cn('HorizontalMenu', 'Text')({
            height: height || 'large',
            isActive
          })}>
            {isFirstWordHighlighted ? highlightFirstWord(title) : title}
          </div>
          { hasDropdown && 
            <Icon
              id='arrow'
              size='s'
              className={cnIcon}
            />
          }
        </a>
        { hasDropdown &&
          <DropdownMenu
            isAsync={isAsync}
            // src={src}
            isLoading={isLoading}
            items={items}
            isShown={this.state.isDropdownShown}
          />
        } 
      </li>
    )
  }
}