import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import Icon from 'components/Icons/Icon/Icon';

import './RepositoryHeader.scss';
import './-Title/RepositoryHeader-Title.scss';
import './-Trunk/RepositoryHeader-Trunk.scss';
import './-TrunkIcon/RepositoryHeader-TrunkIcon.scss';

interface RepositoryHeaderProps {
  repoId: string | undefined;
}

export default class RepositoryHeader extends Component<RepositoryHeaderProps> {
  render() {
    const { repoId } = this.props;
    const cnRH = cn('RepositoryHeader');

    return (
      <div className={cnRH()}>
        <span className={cnRH('Title')}>{repoId}</span>
        <span className={cnRH('Trunk')}>
          trunk
          <Icon
            id='arrow'
            size='m'
            color='secondary'
            className={cnRH('TrunkIcon')}
          />
        </span>
      </div>
    )
  }
}