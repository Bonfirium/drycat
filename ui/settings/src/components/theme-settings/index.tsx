import { Divider, Typography } from '@material-ui/core';
import FolderPath from './folder';
import RandomThemes from './random';
import styles from './styles.module.scss';


function ThemeSettings() {
  console.log(styles);
  return (
    <div className={styles.themeSettings}>
      <Typography variant="h4">
          Theme Settings
      </Typography>
      <Divider />
      <FolderPath />
      <RandomThemes />
    </div>
  );
}

export default ThemeSettings;
