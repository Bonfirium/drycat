import TabMenu from 'components/tab-menu';
import ThemeSettings, { menu as themeMenu } from 'components/theme-settings';
import GlobalSettings, { menu as globalMenu } from 'components/global-settings';
import SideMenu from 'components/side-menu';

// import TabMenuArea from 'components/tab-menu/area';

const App = () => {
  const items = [
    globalMenu,
    themeMenu,
  ];
  return (
    <div>
      <SideMenu items={items}/>
      {/* <TabMenu active={1} items={[
        { label: 'Global', element: <GlobalSettings/> },
        { label: 'Theme', element: <ThemeSettings/> },
      ]}
      /> */}
    </div >
  );
}

export default App;
