import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import 'components/Layout/-Container/_border/Layout-Container_border_top.scss';
import 'components/Layout/-Container/_border/Layout-Container_border_bottom.scss';

export interface LayoutContainerProps {
  border?: string;
}

export default class LayoutContainer extends Component<LayoutContainerProps> {
  render() {
    const cnLayoutContainer = cn('Layout', 'Container');
    const { children, border } = this.props;
    
    return (
      <div className={cnLayoutContainer({ border })}>
        {children}
      </div>
    )
  }
}