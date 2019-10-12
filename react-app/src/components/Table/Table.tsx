import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import Icon from '../Icons/Icon/Icon';
import { FileRow, File } from 'components/RepositoryView/RepositoryView';

import './Table.scss';
import './-Body/Table-Body.scss';
import './-BodyCell/Table-BodyCell.scss';
import './-BodyRow/Table-BodyRow.scss';
import './-Head/Table-Head.scss';
import './-HeadCell/Table-HeadCell.scss';
import './-HeadRow/Table-HeadRow.scss';
import './-FileLink/Table-FileLink.scss';
import './-FileIcon/_marginRight/Table-FileIcon_marginRight_l.scss';

export interface FileRowElement {
  file: JSX.Element,
  lastCommit: JSX.Element,
  commitMessage: JSX.Element,
  committer: JSX.Element,
  updated: JSX.Element
}

const attachIcons = (items: FileRow[]): FileRowElement[] => {
  return items.map(item => {
    const { file } = item;
    const cnFileLink = cn('Table', 'FileIcon')({ marginRight: 'l' });
    
    if (file.isDir) {
      return {
        file: <>
          <Icon id='folder' size='xs' color='primary' className={cnFileLink} />
          {file.content}
        </>,
        lastCommit: <></>,
        commitMessage: <></>,
        committer: <></>,
        updated: <></>
      };
    }

    const match = file.fileName.match(/\..+$/i);
    const ext = match && match[0];

    switch(ext) {
      case '.md':
        // return [
        //   <>
        //     <Icon id='file' size='xs' color='primary' className={cnFileLink} />
        //     {file.content}
        //   </>,
        //   ...other
        // ];
        return {
          file: <>
              <Icon id='file' size='xs' color='primary' className={cnFileLink} />
              {file.content}
            </>,
          lastCommit: <></>,
          commitMessage: <></>,
          committer: <></>,
          updated: <></>
        };
      default:
        // return [
        //   <>
        //     <Icon id='fileCode' size='xs' color='primary' className={cnFileLink} />
        //     {file.content}
        //   </>,
        //   ...other
        // ];
        return {
          file: <>
            <Icon id='fileCode' size='xs' color='primary' className={cnFileLink} />
            {file.content}
          </>,
          lastCommit: <></>,
          commitMessage: <></>,
          committer: <></>,
          updated: <></>
        };
    }
  });
}

const compareStrings = (a: string, b: string): number => {
  a = a.toUpperCase();
  b = b.toUpperCase();

  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

const sortFilesItems = (items: FileRow[]) => {
  return items.sort((fileRow1: FileRow, fileRow2: FileRow): number => {
    const file1 = fileRow1.file;
    const file2 = fileRow2.file;

    if (file1.isDir && file2.isDir) {
      return compareStrings(file1.fileName, file2.fileName);
    }
    else if (file1.isDir && !file2.isDir) {
      return -1;
    }
    else if (!file1.isDir && file2.isDir) {
      return 1;
    }
    else {
      return compareStrings(file1.fileName, file2.fileName);
    }
  });
}

export interface TableProps {
  head: string[];
  items: FileRow[];
  view: string;
}

export default class Table extends Component<TableProps> {
  render() {
    const { head, items: rawItems, view } = this.props;
    let items;

    switch (view) {
      case 'files':
      default:
        items = attachIcons(sortFilesItems(rawItems));
        break;
    }

    const cnTable = cn('Table');

    return (
      <table className={cnTable()}>
        <thead className={cnTable('Head')}>
          <tr className={cnTable('HeadRow')}>
            {head.map((thContent, idx) =>
              <th className={cnTable('HeadCell')} key={idx}>{thContent}</th>
            )}
          </tr>
        </thead>

        <tbody className={cnTable('Body')}>
          {items.map((row: FileRowElement, idx: number) =>
            <tr className={cnTable('BodyRow')} key={idx}>
              <td className={cnTable('BodyCell')}>{row.file}</td>
              <td className={cnTable('BodyCell')}>{row.lastCommit}</td>
              <td className={cnTable('BodyCell')}>{row.commitMessage}</td>
              <td className={cnTable('BodyCell')}>{row.committer}</td>
              <td className={cnTable('BodyCell')}>{row.updated}</td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}