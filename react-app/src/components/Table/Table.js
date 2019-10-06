import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import Icon from '../Icons/Icon/Icon';

import './Table.scss';
import './-Body/Table-Body.scss';
import './-BodyCell/Table-BodyCell.scss';
import './-BodyRow/Table-BodyRow.scss';
import './-Head/Table-Head.scss';
import './-HeadCell/Table-HeadCell.scss';
import './-HeadRow/Table-HeadRow.scss';
import './-FileLink/Table-FileLink.scss';
import './-FileIcon/_marginRight/Table-FileIcon_marginRight_l.scss';

const attachIcons = items => {
  return items.map(item => {
    const [file, ...other] = item;
    const cnFileLink = cn('Table', 'FileIcon')({ marginRight: 'l' });
    
    if (file.isDir) {
      return [
        <>
          <Icon id='folder' size='xs' color='primary' className={cnFileLink} />
          {file.content}
        </>,
        ...other
      ];
    }

    const match = file.fileName.match(/\..+$/i);
    const ext = match && match[0];

    switch(ext) {
      case '.md':
        return [
          <>
            <Icon id='file' size='xs' color='primary' className={cnFileLink} />
            {file.content}
          </>,
          ...other
        ];
      default:
        return [
          <>
            <Icon id='fileCode' size='xs' color='primary' className={cnFileLink} />
            {file.content}
          </>,
          ...other
        ];
    }
  });
}

const compareStrings = (a, b) => {
  a = a.toUpperCase();
  b = b.toUpperCase();

  if (a > b) return 1;
  if (a < b) return -1;
  if (a === b) return 0;
}

const sortFilesItems = items => {
  return items.sort((a, b) => {
    a = a[0];
    b = b[0];

    if (a.isDir && b.isDir) {
      return compareStrings(a.fileName, b.fileName);
    }
    else if (a.isDir && !b.isDir) {
      return -1;
    }
    else if (!a.isDir && b.isDir) {
      return 1;
    }
    else {
      return compareStrings(a.fileName, b.fileName);
    }
  });
}

export default class Table extends Component {
  render() {
    const { head, items: rawItems, cnCols, view } = this.props;
    let filesItems;

    if (view === 'files') {
      filesItems = attachIcons(sortFilesItems(rawItems));
    }

    const items = filesItems || rawItems;
    const cnTable = cn('Table');

    return (
      <table className={cnTable()}>
        <thead className={cnTable('Head')}>
          <tr className={cnTable('HeadRow')}>
            {head.map((thContent, idx) =>
              <th className={cnTable('HeadCell') + ' ' + cnCols} key={idx}>{thContent}</th>
            )}
          </tr>
        </thead>

        <tbody className={cnTable('Body')}>
          {items.map((tds, idx) => {
            return (
              <tr className={cnTable('BodyRow')} key={idx}>
                {tds.map((content, idx) => 
                  <td className={cnTable('BodyCell') + ' ' + cnCols} key={idx}>{content}</td>
                )}
              </tr>
            )}
          )}
        </tbody>
      </table>
    )
  }
}