import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import 'components/Layout/-Block/Layout-Block.scss';

export default class LayoutBlock extends Component {
  render() {
    const cnLayoutBlock = cn('Layout', 'Block');
    
    return (
      <div className={cnLayoutBlock()}>
        {this.props.children}
      </div>
    )
  }
}