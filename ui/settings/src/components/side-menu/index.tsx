import React, { useState } from 'react';
import { Divider, ListSubheader, List, ListItem, Collapse, ListItemText } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import styles from './styles.module.scss';
import classnames from 'classnames';

interface IParent {
  label: string;
  subitems: IChild[];
}

interface IEParent extends IParent {
  opened: boolean;
  active: boolean;
}

interface IChild {
  label: string;
  element: React.ReactElement;
}

type IItem = IChild | IParent;



interface IProps {
  items: IParent[];
}

const prepareItems = (items: IParent[]) => items.map<IEParent>((item) => ({
  ...item,
  opened: true,
  active: false,
}));

const SideMenu: React.FC<IProps> = ({ items: rawItems }) => {

  const [panel, setPanel] = useState<React.ReactElement>();
  const [items, setItems] = useState(prepareItems(rawItems));

  const toggleOpened = (i: number) => {
    items[i].opened = !items[i].opened;
    setItems([...items]);
  }

  const parseChilds = (items: IChild[]) => items.map((item) => (
    <ListItem
      button
      onClick={() => setPanel(item.element)}
      className={classnames(styles.childItem, { [styles.active]: panel === item.element })}
    >
      {console.log(panel === item.element)}
      <ListItemText primary={item.label} />
    </ListItem>
  ))

  const parseParents = (items: IEParent[]) => items.reduce<React.ReactElement[]>((all, item, i) => {
    all.push(
      <ListItem
        button
        onClick={() => toggleOpened(i)}
        className={styles.parentItem}
      >
        <ListItemText primary={item.label} />
        {item.opened ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
    );
    all.push(
      <Collapse in={item.opened} timeout="auto" unmountOnExit className={styles.childItemContainer}>
        <List component="div" disablePadding>
          {parseChilds(item.subitems)}
        </List>
      </Collapse>
    );
    return all;
  }, []);
  console.log(panel);
  return (
    <div className={styles.menu}>
      <List
        component="li"
        aria-labelledby="nested-list-subheader"
        className={styles.itemContainer}
      >
        {parseParents(items)}
      </List>
      <Divider variant="fullWidth" orientation="vertical" />
      <div className={styles.panel}>
        {panel}
      </div>
    </div>
  );
}

export default SideMenu;
