import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import './FileViewTable.scss'
import './-Body/FileViewTable-Body.scss';
import './-CounterCell/FileViewTable-CounterCell.scss';
import './-Row/FileViewTable-Row.scss';
import './-StringCell/FileViewTable-StringCell.scss';

export default class FileViewTable extends Component {
  render() {
    const { file } = this.props;
    const cnFVTable = cn('FileViewTable');

    return (
      <table className={cnFVTable()}>
        <tbody className={cnFVTable('Body')}>
          {file.split('\n').map((string, idx) => {
            return (
              <tr className={cnFVTable('Row')} key={idx}>
                <td className={cnFVTable('CounterCell')}></td>
                <td className={cnFVTable('StringCell')}>
                  <pre>{string}</pre>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}