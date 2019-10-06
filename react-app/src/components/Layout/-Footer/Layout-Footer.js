import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import 'components/Layout/-Footer/Layout-Footer.scss';

export default class LayoutFooter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cnLayoutFooter = cn('Layout', 'Footer');
    
    return (
      <div className={cnLayoutFooter()}>
        {this.props.children}
      </div>
    )
  }
}