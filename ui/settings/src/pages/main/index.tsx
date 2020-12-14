import TabMenu from 'components/tab-menu';
import ThemeSettings from 'components/theme-settings';
import GlobalSettings from 'components/global-settings';

// import TabMenuArea from 'components/tab-menu/area';

const App = () => {
  return (
    <div>
      <TabMenu active={1} items={[
        { label: 'Global', element: <GlobalSettings/> },
        { label: 'Theme', element: <ThemeSettings/> },
      ]}
      />
    </div >
  );
}

export default App;
