import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles.module.scss';

interface IProps {
	active: number,
	items: { label: string, element: React.ReactElement }[];
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		display: 'flex',
		height: 224,
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,
	},
}));

const TabMenu: React.FC<IProps> = ({ items, active }) => {
	const classes = useStyles();
	const [choosed, setChoosed] = useState(active);
	// TODO: refactor
	const [{ tabs, elements }] = useState(
		items.reduce<{ tabs: React.ReactElement[], elements: React.ReactElement[] }>(
			(result, { label, element }, i) => {
				result.tabs.push(<Tab label={label}/>);
				result.elements.push(element);
				return result;
			}, { tabs: [], elements: [] }));
	return (
		<div className={classes.root}>
			<Tabs
				orientation="vertical"
				variant="scrollable"
				value={choosed}
				onChange={(_, newValue) => setChoosed(newValue)}
				aria-label="Vertical tabs example"
				className={classes.tabs}
			>
				{tabs}
			</Tabs>
			{elements[choosed]}
		</div >
	);
}

export default TabMenu;
