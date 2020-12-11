import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

interface IProps {
  isActive: boolean;
  label: string;
  toggle(): void;
};

const TabMenuItem: React.FC<IProps> = (props) => {
  return (
    <div
      className={classNames(styles.item, { [styles.active]: props.isActive })}
      onClick={props.toggle}
    >
      <div className={styles.label}>{props.label}</div>
    </div>
  );
}

export default TabMenuItem;
