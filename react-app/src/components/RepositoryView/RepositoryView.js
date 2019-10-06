import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@bem-react/classname';

import Table from 'components/Table/Table';
import Spinner from 'components/Spinner/Spinner';
import { url } from 'config/server.config';
import RepositoryBreadcrumbs from 'components/RepositoryBreadcrumbs/RepositoryBreadcrumbs';
import RepositoryHeader from 'components/RepositoryHeader/RepositoryHeader';

export default class RepositoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFilesDownloaded: false,
      head: ['Name', 'Last commit', 'Commit message', 'Committer', 'Updated'],
      files: undefined
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
    } = (this.props.match && this.props.match.params) || {};

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
      url: ((this.props.match && this.props.match.url) || '').slice(1),
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

  requestFiles(apiPath) {
    fetch(`${url}/api/${apiPath}`).then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
      .then(files => {
        this.setState({
          files: files.map(({ fileName, isDir }) => {
            const { repoId, commitHash, path } = this.state;
            const endPath =
              (commitHash ? commitHash + '/' : 'master/') +
              (path ? path + '/' : '') +
              fileName;
            const cnFileLink = cn('Table', 'FileLink');

            return [{
              fileName,
              isDir,
              content: (isDir ?
                <NavLink to={`/repos/${repoId}/tree/${endPath}`} className={cnFileLink()}>{fileName}</NavLink> :
                <NavLink to={`/repos/${repoId}/blob/${endPath}`} className={cnFileLink()}>{fileName}</NavLink>
              )
            }, '', '', '', '']
          }),
          isFilesDownloaded: true
        });
      })
      .catch(err => {
        console.log(err)
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
        {isFilesDownloaded ?
          <Table head={head} items={files} view='files'/> :
          <Spinner />
        }
      </>
    )
  }
}