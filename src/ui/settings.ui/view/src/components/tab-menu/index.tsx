import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useState } from 'react';
import styles from './styles.module.scss';

interface IProps {
	active: number,
	items: { label: string, element: React.ReactElement }[];
}

const TabMenu: React.FC<IProps> = ({ items, active }) => {
	const [choosed, setChoosed] = useState(active);
	// TODO: refactor
	const [{ tabs, elements }] = useState(
		items.reduce<{ tabs: React.ReactElement[], elements: React.ReactElement[] }>(
			(result, { label, element }, i) => {
				result.tabs.push(<Tab className={styles.item} label={label} key={i}/>);
				result.elements.push(element);
				return result;
			}, { tabs: [], elements: [] }));
	return (
		<div className={styles.tabMenu}>
			<Tabs
				orientation="vertical"
				variant="scrollable"
				value={choosed}
				onChange={(_, newValue) => setChoosed(newValue)}
				className={styles.itemContainer}
			>
				{tabs}
			</Tabs>
			<div className={styles.panel}>
				{elements[choosed]}
			</div>
		</div >
	);
}

export default TabMenu;
