import React from 'react';
import { RouteComponentProps } from 'react-router';

import RepositoryView from 'components/RepositoryView/RepositoryView';
import Spinner from 'components/Spinner/Spinner';

export default function RootPage(isReposReceived: boolean, repoId: string | undefined) {
  return (props: RouteComponentProps) => {
    return (
      isReposReceived && repoId
        ? <RepositoryView {...props} repoId={repoId} />
        : <Spinner />
    )
  }
}