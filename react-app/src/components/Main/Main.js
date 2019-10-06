import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Spinner from 'components/Spinner/Spinner';
import RepositoryView from 'components/RepositoryView/RepositoryView';
import FileView from 'components/FileView/FileView';
import NotFoundView from 'components/NotFoundView/NotFoundView';

export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isReposReceived, repos } = this.props;

    return (
      <Switch>
        <Route exact path='/'>
          {isReposReceived ?
            <RepositoryView repoId={repos[0]} /> :
            <Spinner />
          }
        </Route>
        <Route exact path='/repos'></Route>
        <Route exact path='/repos/:repoId' component={RepositoryView} />
        <Route exact path='/repos/:repoId/tree'></Route>
        <Route exact path='/repos/:repoId/tree/:commitHash' component={RepositoryView} />
        <Route exact path='/repos/:repoId/tree/:commitHash/:path(*)' component={RepositoryView} />
        <Route exact path='/repos/:repoId/blob/:commitHash/:path(*)' component={FileView}></Route>
        <Route component={NotFoundView} />
      </Switch>
    )
  }
}