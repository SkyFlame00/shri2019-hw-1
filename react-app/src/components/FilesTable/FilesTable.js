import React, { Component } from 'react';

import Table from 'components/Table/Table';
import Spinner from 'components/Spinner/Spinner';
import { url } from 'config/server.config';

export default class FilesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: undefined,
      isFilesDownloaded: false,
      head: ['Name', 'Last commit', 'Commit message', 'Committer', 'Updated']
    };
    this.requestFiles(props.apiPath);
  }

  requestFiles(apiPath) {
    console.log(url, apiPath)
    fetch(`${url}/${apiPath}`).then(res => res.json())
      .then(files => {
        console.log(files)
        this.setState({
          files: files.map(file => [file, '', '', '', '']),
          isFilesDownloaded: true
        });
      });
  }

  render() {
    const { isFilesDownloaded, head, files } = this.state;

    return (
      isFilesDownloaded ?
        <Table head={head} items={files} view='files'/> :
        <Spinner />
    )
  }
}