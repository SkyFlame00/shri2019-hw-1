import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import './Spinner.scss';

export default class Spinner extends Component {
  render() {
    return (
      <div className={cn('Spinner')()}></div>
    )
  }
}