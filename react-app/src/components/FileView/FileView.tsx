import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { cn } from '@bem-react/classname';

import Icon from 'components/Icons/Icon/Icon';
import Spinner from 'components/Spinner/Spinner';
import { url } from 'config/server.config';
import FileViewTable from 'components/FileViewTable/FileViewTable';
import RepositoryBreadcrumbs from 'components/RepositoryBreadcrumbs/RepositoryBreadcrumbs';
import RepositoryHeader from 'components/RepositoryHeader/RepositoryHeader';

import './-Bytes/FileView-Bytes.scss';
import './-Col/FileView-Col.scss';
import './-Col/_position/FileView-Col_position_left.scss'
import './-Col/_position/FileView-Col_position_right.scss'
import './-Download/FileView-Download.scss';
import './-Filename/FileView-Filename.scss';
import './-Header/FileView-Header.scss';
import './-Icon/FileView-Icon.scss';
import './-Wrapper/FileView-Wrapper.scss';

interface State {
  commitHash: string | undefined;
  repoId: string | undefined;
  path: string | undefined;
  isFileDownloaded: boolean;
  file: string | undefined;
}

export default class FileView extends Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);

    const {
      repoId,
      commitHash,
      path
    }: ArcanumReact.MatchParams = (this.props.match && this.props.match.params) || {};

    this.requestFiles(`repos/${repoId}/blob/${commitHash}/${path}`);

    this.state = {
      isFileDownloaded: false,
      file: undefined,
      repoId,
      commitHash,
      path
    };
  }

  checkUpdate() {
    const {
      commitHash: prevCommitHash,
      repoId: prevRepoId,
      path: prevPath
    } = this.state;

    const {
      repoId,
      commitHash,
      path
    }: ArcanumReact.MatchParams = (this.props.match && this.props.match.params) || {};

    if (prevRepoId === repoId &&
        prevCommitHash === commitHash &&
        prevPath === path
    ) {
      return;
    }

    this.requestFiles(`repos/${repoId}/blob/${commitHash}/${path}`);
    this.setState({
      isFileDownloaded: false,
      file: undefined,
      repoId,
      commitHash,
      path
    });
  }

  componentDidMount() {
    this.checkUpdate();
  }

  componentDidUpdate() {
    this.checkUpdate();
  }

  requestFiles(apiPath: string) {
    fetch(`${url}/api/${apiPath}`).then(res => res.text())
      .then(file => {
        this.setState({ isFileDownloaded: true, file });
      });
  }

  render() {
    const {
      isFileDownloaded,
      file,
      repoId,
      commitHash,
      path,
    } = this.state;
    const cnFV = cn('FileView');
    const pathArr = path && path.split('/')
    const fileName = (pathArr && pathArr[pathArr.length - 1]) || '';
    
    return (
      <>
        <RepositoryBreadcrumbs
          repoId={repoId}
          commitHash={commitHash}
          path={path}
        />
        <RepositoryHeader repoId={repoId} />
        <div className={cnFV()}>
          <div className={cnFV('Wrapper')}>
            <div className={cnFV('Header')}>
              <div className={cnFV('Col', {position: 'left'})}>
                <div className={cnFV('Icon')}>

                </div>
                <span className={cnFV('Filename')}>{fileName}</span>
                <span className={cnFV('Bytes')}></span>
              </div>
              <div className={cnFV('Col', {position: 'right'})}>
                <a href='#' className={cnFV('Download')}>
                  <Icon id='download' color='primary' size='m' />
                </a>
              </div>
            </div>

            {isFileDownloaded ?
              <FileViewTable file={file} /> :
              <Spinner />
            }
          </div>
        </div>
      </>
    )
  }
}