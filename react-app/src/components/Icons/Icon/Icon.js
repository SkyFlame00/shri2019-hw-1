import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import './Icon.scss';
import '../IconArrow/IconArrow.scss';
import '../IconFile/IconFile.scss';
import '../IconFolder/IconFolder.scss';
import '../IconFileCode/IconFileCode.scss';
import '../IconDownload/IconDownload.scss';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getIconBlockName = id => {
  const ids = [
    'arrow',
    'file',
    'folder',
    'fileCode',
    'download'
  ];

  const result = ids.find(item => item === id);

  return result ?
    'Icon' + capitalizeFirstLetter(result) :
    null;
}

export default class Icon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, position, size, color, className } = this.props;
    const blockName = getIconBlockName(id);
    let cnIcon;

    if (blockName) {
      const mods = {position, size, color};
      cnIcon = cn(blockName)(mods);
    }

    const cssClasses = [
      'Icon',
      blockName ? cnIcon : ''
    ].join(' ');

    return (
      <i className={cssClasses + ' ' + (className || '')}></i>
    )
  }
}