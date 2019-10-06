import React, { Component } from 'react';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';

export default class RepositoryBreadcrumbs extends Component {
  render() {
    const { repoId, commitHash, path } = this.props;
    let fullPathArr;
    
    if (path) {
      let pathArr = path.split('/');
      const currentLocation = pathArr[pathArr.length - 1];
      pathArr = pathArr.slice(0, pathArr.length - 1);

      pathArr = pathArr.reduce((paths, pathStr) => {
        // Для первого инициализируем
        if (!paths) {
          return [{
            title: pathStr,
            to: `/repos/${repoId}/tree/${commitHash}/${pathStr}`
          }];
        }

        // Прибавляем предыдущий путь к текущему
        paths.push({
          title: pathStr,
          to: `${paths[paths.length - 1].to}/${pathStr}`
        });

        return paths;
      }, null);

      fullPathArr = [
        {
          title: repoId,
          to: `/repos/${repoId}`
        },
        ...(pathArr || []),
        {
          title: currentLocation
        }
      ];
    }
    else {
      fullPathArr = [{
        title: repoId
      }];
    }
    
    return (
      <Breadcrumbs items={fullPathArr} />
    )
  }
}