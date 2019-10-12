import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import './FileViewTable.scss'
import './-Body/FileViewTable-Body.scss';
import './-CounterCell/FileViewTable-CounterCell.scss';
import './-Row/FileViewTable-Row.scss';
import './-StringCell/FileViewTable-StringCell.scss';

export interface FileViewTableProps {
  file: string | undefined;
}

const cnFVTable = cn('FileViewTable');

const createTableRow = (str: string, idx?: number) => {
  return (
    <tr className={cnFVTable('Row')} key={idx}>
      <td className={cnFVTable('CounterCell')}></td>
      <td className={cnFVTable('StringCell')}>
        <pre>{str}</pre>
      </td>
    </tr>
  )
}

export default class FileViewTable extends Component<FileViewTableProps> {
  render() {
    const { file } = this.props;

    return (
      <table className={cnFVTable()}>
        <tbody className={cnFVTable('Body')}>
          {file ? file.split('\n').map(createTableRow) : createTableRow('')}
        </tbody>
      </table>
    )
  }
}