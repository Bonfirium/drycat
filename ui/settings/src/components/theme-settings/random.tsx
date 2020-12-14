import Button from '@material-ui/core/Button';
import { Divider } from '@material-ui/core';
import styles from './styles.module.scss';

function RandomThemes() {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(args);
  };

  return (
    <div className={styles.random}>
    <input
        accept="image/*"
        id="contained-button-file"
        multiple
        type="file"
        className={styles.dirInput}
        onChange={handleChange}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Upload
        </Button>
      </label>
    </div>
  );
}

export default RandomThemes;
