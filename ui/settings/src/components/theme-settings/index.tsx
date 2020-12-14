import { Divider } from '@material-ui/core';
import styles from './styles.module.scss';
import RandomThemes from './random';


function ThemeSettings() {
  console.log(styles);
  return (
    <div className={styles.themeSettings}>
      <h1>Theme settings</h1>
      <Divider/>
      <RandomThemes/>
    </div>
  );
}

export default ThemeSettings;
