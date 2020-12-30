import { useState } from 'react';
import { FormLabel, ButtonGroup, FormHelperText, Input, Button, FormControl, InputLabel, TextField, InputBase } from '@material-ui/core';
import { q } from '../../ipc/settings.ipc';

function FolderPath() {
  const [path] = useState('/home/demid/shit/');
  const [error] = useState();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
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
              <Button>Change</Button>
            </ButtonGroup>
            )
          }} />
        {error ? <FormHelperText id="component-error-text">{error}</FormHelperText> : null}
      </FormControl>
    </div>
  );
}

export default FolderPath;
