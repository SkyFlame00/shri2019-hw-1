import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { cn } from '@bem-react/classname';

import Table from 'components/Table/Table';
import Spinner from 'components/Spinner/Spinner';
import { url } from 'config/server.config';
import RepositoryBreadcrumbs from 'components/RepositoryBreadcrumbs/RepositoryBreadcrumbs';
import RepositoryHeader from 'components/RepositoryHeader/RepositoryHeader';

export interface RepositoryViewProps {
  repoId?: string;
}

interface State {
  isFilesDownloaded: Boolean;
  head: string[];
  files: FileRow[] | undefined;
  commitHash: string | undefined;
  repoId: string | undefined;
  path: string | undefined;
}

export interface FileBasic {
  isDir: boolean;
  fileName: string;
}

export type File = FileBasic & {
  content: (JSX.Element | string)[];
}

export type FileRow = {
  file: File,
  lastCommit: {},
  commitMessage: {},
  committer: {},
  updated: {}
};

type Props = RepositoryViewProps & RouteComponentProps;

export default class RepositoryView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isFilesDownloaded: false,
      head: ['Name', 'Last commit', 'Commit message', 'Committer', 'Updated'],
      files: undefined,
      repoId: undefined,
      commitHash: undefined,
      path: undefined
    };
  }

  checkUpdate() {
    const {
      commitHash: prevCommitHash,
      repoId: prevRepoId,
      path: prevPath
    } = this.state;
    
    const {
      repoId: matchedRepoId,
      commitHash,
      path
    }: ArcanumReact.MatchParams = (this.props && this.props.match && this.props.match.params) || {};

    const repoId = this.props.repoId || matchedRepoId;

    if (prevRepoId === repoId &&
        prevCommitHash === commitHash &&
        prevPath === path
    ) {
      return;
    }
    
    if (!commitHash) {
      this.requestFiles(`repos/${repoId}`);
    }
    else if (!path) {
      this.requestFiles(`repos/${repoId}/tree/${commitHash}`);
    }
    else {
      this.requestFiles(`repos/${repoId}/tree/${commitHash}/${path}`);
    }

    this.setState({
      isFilesDownloaded: false,
      files: undefined,
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
    fetch(`${url}/api/${apiPath}`).then(res => res.json())
      .then(files => {
        this.setState({
          files: files.map(({ fileName, isDir }: FileBasic) => {
            const { repoId, commitHash, path } = this.state;
            const endPath =
              (commitHash ? commitHash + '/' : 'master/') +
              (path ? path + '/' : '') +
              fileName;
            const cnFileLink = cn('Table', 'FileLink');

            return {
              file: {
                fileName,
                isDir,
                content: (isDir
                  ? <NavLink to={`/repos/${repoId}/tree/${endPath}`} className={cnFileLink()}>{fileName}</NavLink>
                  : <NavLink to={`/repos/${repoId}/blob/${endPath}`} className={cnFileLink()}>{fileName}</NavLink>
                )
              },
              lastCommit: '',
              commitMessage: '',
              committer: '',
              updated: ''
            };
          }),
          isFilesDownloaded: true
        });
      });
  }

  render() {
    const {
      isFilesDownloaded,
      head,
      files,
      repoId,
      commitHash,
      path
    } = this.state;

    return (
      <>
        <RepositoryBreadcrumbs
          repoId={repoId}
          commitHash={commitHash}
          path={path}
        />
        <RepositoryHeader repoId={repoId} />
        {files && isFilesDownloaded ?
          <Table head={head} items={files} view='files'/> :
          <Spinner />
        }
      </>
    )
  }
}