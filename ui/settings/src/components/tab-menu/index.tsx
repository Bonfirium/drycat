import TabMenuItem from './item';
import classNames from 'classnames';
import gStyles from 'global.module.scss';
import styles from './styles.module.scss';
import { useState } from 'react';

interface IProps {
  onChange(index: number): void;
  items: string[];
  choosedIndex: number;
}

const TabMenu: React.FC<IProps> = ({ onChange: handler, items, choosedIndex }) => {
  const [choosed, setChoosed] = useState(choosedIndex);

  const handleToggle = (newIndex: number) => {
    if (choosed === newIndex) return;
    setChoosed(newIndex);
    handler();
  };

  return (
    <div className={classNames(styles.tabMenu, gStyles.centerVertical)}>
      {items.map((label, index) => <TabMenuItem
        key={index}
        label={label}
        isActive={choosed === index}
        toggle={() => handleToggle(index)}
      />)}
    </div>
  );
}

export default TabMenu;
