import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import 'components/Layout/Layout.scss';

export interface LayoutProps {
  className: string;
}

export default class Layout extends Component<LayoutProps> {
  render() {
    const cnLayout = cn('Layout');
    const classes = `${cnLayout()} ${this.props.className || ''}`;
    
    return (
      <div className={classes}>
        {this.props.children}
      </div>
    )
  }
}