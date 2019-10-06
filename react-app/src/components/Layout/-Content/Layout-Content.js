import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import 'components/Layout/-Content/Layout-Content.scss';

export default class LayoutContent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cnLayoutContent = cn('Layout', 'Content');
    
    return (
      <div className={cnLayoutContent()}>
        {this.props.children}
      </div>
    )
  }
}