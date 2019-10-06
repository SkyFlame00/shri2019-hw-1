import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { Link } from 'react-router-dom';

import Layout from 'components/Layout/Layout';
import LayoutBlock from 'components/Layout/-Block/Layout-Block';
import LayoutContainer from 'components/Layout/-Container/Layout-Container';
import LayoutContent from 'components/Layout/-Content/Layout-Content';
import LayoutFooter from 'components/Layout/-Footer/Layout-Footer';

import Header from 'components/Header/Header';
import FilesTable from 'components/FilesTable/FilesTable';
import { url } from 'config/server.config';
import Main from 'components/Main/Main';

import './App.scss'
import 'components/Theme/_color/Theme_color_project-default.scss';
import 'components/Theme/_size/Theme_size_default.scss';
import 'components/Theme/_fonts/Theme_fonts_default.scss';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isReposReceived: false,
      repos: undefined
    };
  }

  componentDidMount() {
    this.requestReposList();
  }

  requestReposList() {
    fetch(`${url}/api/repos/`).then(res => res.json())
      .then(repos => this.setState({ repos, isReposReceived: true }))
  }

  render() {
    const themeStyles = cn('Theme')({
      color: 'project-default',
      size: 'default',
      fonts: 'default'
    });

    return (
      <Layout className={themeStyles}>
        <LayoutContent>
          <LayoutContainer border='bottom'>
            <LayoutBlock>
              <Header
                isReposReceived={this.state.isReposReceived}
                repos={this.state.repos}
              />
            </LayoutBlock>
          </LayoutContainer>

          <LayoutContainer>
            <LayoutBlock>
              <Main
                isReposReceived={this.state.isReposReceived}
                repos={this.state.repos}
              />
            </LayoutBlock>
          </LayoutContainer>
        </LayoutContent>
      </Layout>
    )
  }
}