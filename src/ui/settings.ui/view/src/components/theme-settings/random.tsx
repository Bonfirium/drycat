import { FormControl, FormGroup, FormLabel, FormControlLabel, Switch, TableContainer, Table, TableRow, TableHead, TableCell, TableBody, Paper, Checkbox, TextField, Input, ButtonGroup, Button, Container, FormHelperText, Box, Tooltip } from '@material-ui/core';
import { useState } from 'react';
import gStyles from 'global.module.scss';
import styles from './styles.module.scss';

const columns = [
  { field: 'name', header: 'Theme Name' },
  { field: 'wiehgt', header: 'Weight', type: 'number' },
]

const data: { name: string, weight: number, choosed?: boolean, error?: string }[] = [
  { name: "default", weight: 100 },
  { name: "dryCat", weight: 50 },
  { name: "notChoosed", weight: 0 },
  { name: "heck", weight: 1 },
];

enum TOGGLE_ALL_STATUS {
  EMPTY,
  HALF,
  CHECKED,
}

function RandomThemes() {

  const [rows, setRows] = useState([...data]);
  const [weight, setWeight] = useState(0);
  const [weightError, setWeightError] = useState<string | undefined>();
  const [toggleAllStatus, setToggleAllStatus] = useState(TOGGLE_ALL_STATUS.EMPTY);
  const toggleAll = (checked: boolean) => {
    for (let i = 0; i < data.length; i++) {
      data[i].choosed = checked;
    }
    if (checked) setToggleAllStatus(TOGGLE_ALL_STATUS.CHECKED);
    else setToggleAllStatus(TOGGLE_ALL_STATUS.EMPTY);
    setRows([...data]);
  }

  const toggleOne = (i: number, checked: boolean) => {
    data[i].choosed = checked;
    const choosedCount = data.reduce<number>((count, { choosed }) => choosed === true ? count + 1 : count, 0);
    if (choosedCount === 0) setToggleAllStatus(TOGGLE_ALL_STATUS.EMPTY);
    else if (choosedCount === data.length) setToggleAllStatus(TOGGLE_ALL_STATUS.CHECKED);
    else setToggleAllStatus(TOGGLE_ALL_STATUS.HALF);
    setRows([...data]);
  }

  const setWeightToChoosed = () => {
    console.log('newWeight', weight)
    for (const theme of data) {
      if (theme.choosed) theme.weight = weight;
    }
    console.log(data);
    setRows([...data]);
  }

  const setErrorFor = (i: number, error?: string) => {
    data[i].error = error;
    setRows([...data]);
  }

  const changeWeight = (i: number, newWeight: number) => {
    data[i].weight = newWeight;
    data[i].error = undefined;
    setRows([...data]);
  }

  const [status, setStatus] = useState(true);
  const [error] = useState();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
  };

  return (
    <div className={styles.random}>
      <FormLabel component="legend">Themes random</FormLabel>
      <FormControl component="fieldset" margin="normal">
        <FormGroup>
          <FormControlLabel
            control={<Switch color="primary" />}
            label="Enabled"
          // labelPlacement="start"
          />
        </FormGroup>
      </FormControl>
      <Box className={styles.tableContainer}>
        <TableContainer component={Paper} className={styles.table}>
          <Table size="small" aria-label="a dense table" >
            <TableHead>
              <TableRow>
                <TableCell align="left" className={styles.checkbox}>
                  <Checkbox
                    color="primary"
                    onChange={(_, checked) => toggleAll(checked)}
                    indeterminate={toggleAllStatus === TOGGLE_ALL_STATUS.HALF}
                    checked={toggleAllStatus === TOGGLE_ALL_STATUS.CHECKED ? true : false}
                  />
                </TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell size="small" align="left">Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(({ name, weight, choosed, error }, i) => (
                <TableRow key={`table_row_${i}`}>
                  <TableCell align="left" className={styles.checkbox}>
                    <Checkbox
                      color="primary"
                      checked={!!choosed}
                      onChange={(_, checked) => toggleOne(i, checked)}
                    />
                  </TableCell>
                  <TableCell align="left">{name}</TableCell>
                  <TableCell size="small" align="left">
                    <Tooltip open={!!error} title={error || ''}>
                      <Input
                        value={weight}
                        error={!!error}
                        onChange={({ target: { value } }) => {
                          const newValue = Number(value);
                          if (Number.isNaN(newValue)) setErrorFor(i, 'Only numbers allowed')
                          else changeWeight(i, Number(value));
                        }}
                        color="primary"
                        inputProps={error ? { onBlur: () => setErrorFor(i) } : {}}
                      // disableUnderline={true}
                      // onChange={(e) => changeWeight(i, e)}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <FormControl variant="filled">
          <TextField
            // defaultValue={path}
            // onChange={handleChange}
            error={!!weightError}
            onChange={({ target: { value } }) => {
              const newValue = Number(value);
              if (Number.isNaN(newValue)) setWeightError('Only numbers allowed');
              else setWeight(newValue);
            }}
            variant="filled"
            margin="normal"
            size="small"
            value={weight}
            InputProps={{
              onBlur: () => { if (weightError) setWeightError(undefined); },
              endAdornment: <Button
                disabled={(weightError !== undefined || toggleAllStatus === TOGGLE_ALL_STATUS.EMPTY)}
                onClick={setWeightToChoosed}
                size="small"
                variant="contained"
              >Set</Button>
            }} />
          <FormHelperText error={!!weightError}>Set entered integer (weight) to all choosed themes</FormHelperText>
        </FormControl>
      </Box>
    </div>
  );
}

export default RandomThemes;
