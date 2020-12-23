import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';
// import ExpandLess from '@material-ui/icons/ExpandLess';
// import ExpandMore from '@material-ui/icons/ExpandMore';
// import StarBorder from '@material-ui/icons/StarBorder';
interface IParent {
  label: string;
  subitems: IChild[];
}

interface IEParent extends IParent {
  opened: boolean,
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
    >
      <ListItemText primary={item.label} />
    </ListItem>
  ))

  const parseParents = (items: IEParent[]) => items.reduce<React.ReactElement[]>((all, item, i) => {
    all.push(
      <ListItem button onClick={() => toggleOpened(i)}>
        <ListItemText primary={item.label} />
      </ListItem>
    );
    all.push(
      <Collapse in={item.opened} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {parseChilds(item.subitems)}
        </List>
      </Collapse>
    );
    return all;
  }, []);
  console.log(panel);
  return (
    <div>
      <React.Fragment>
        {/* <Button onClick={toggleDrawer(true)}>open!</Button> */}
        <Drawer open={true} variant="permanent">
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                DryCat Settings
              </ListSubheader>}
          // className={classes.root}
          >
            {parseParents(items)}
          </List>
        </Drawer>
      </React.Fragment>
      {panel}
    </div>
  );
}

export default SideMenu;
