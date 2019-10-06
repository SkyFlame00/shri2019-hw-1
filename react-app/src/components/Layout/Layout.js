import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import 'components/Layout/Layout.scss';

export default class Layout extends Component {
  constructor(props) {
    super(props);
  }

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