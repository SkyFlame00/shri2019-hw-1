import React, { Component } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from 'components/Breadcrumbs/Breadcrumbs';

export interface RepositoryBreadcrumbsProps {
  repoId?: string;
  commitHash?: string;
  path?: string;
}

export default class RepositoryBreadcrumbs extends Component<RepositoryBreadcrumbsProps> {
  render() {
    const { repoId, commitHash, path } = this.props;
    let allBreadcrumbsItems: BreadcrumbsItem[];
    
    if (path) {
      let pathArr = path.split('/');
      const currentLocation = pathArr[pathArr.length - 1];
      pathArr = pathArr.slice(0, pathArr.length - 1);

      const breadcrumbsItems = pathArr.reduce((paths: BreadcrumbsItem[], pathStr): BreadcrumbsItem[] => {
        // Для первого инициализируем
        if (paths.length === 0) {
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
      }, []);

      allBreadcrumbsItems = [
        {
          title: repoId || '',
          to: `/repos/${repoId}`
        },
        ...breadcrumbsItems,
        {
          title: currentLocation
        }
      ];
    }
    else {
      allBreadcrumbsItems = [{
        title: repoId || ''
      }];
    }
    
    return (
      <Breadcrumbs items={allBreadcrumbsItems} />
    )
  }
}