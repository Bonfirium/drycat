import { useEffect, useState } from 'react';
import { FormLabel, ButtonGroup, FormHelperText, Input, Button, FormControl, InputLabel, TextField, InputBase } from '@material-ui/core';
// import { q } from '../../ipc/settings.ipc';
import IPC from 'ipc/ipc';

function FolderPath() {
  const [path, setPath] = useState('/home/demid/shit/');
  const [error, setError] = useState();
  // useEffect(() => {
  //   const fn = async () => {
  //     const result = await IPC.getThemeFolderPath([true]);
  //     console.log('AAAAAAAAAAAAAa', result);
  //     setPath(result);
  //   };
  //   fn();
  // }, [])
  const handleChange = () => {
    console.log('handle');
    IPC.getThemeFolderPath([true]).then((result) => {
      console.log('new path', setPath(result));
    });
  };
  console.log('render');
  return (
    <div>
      <FormControl variant="filled" fullWidth>
        <FormLabel component="legend">Themes folder path</FormLabel>
        <TextField
          defaultValue={path}
          // onChange={handleChange}
          variant="filled"
          margin="normal"
          size="small"
          InputProps={{
            endAdornment: (<ButtonGroup size="small" variant="contained">
              <Button>Parse</Button>
              <Button onClick={handleChange}>Change</Button>
            </ButtonGroup>
            )
          }} />
        {error ? <FormHelperText id="component-error-text">{error}</FormHelperText> : null}
      </FormControl>
    </div>
  );
}

export default FolderPath;
