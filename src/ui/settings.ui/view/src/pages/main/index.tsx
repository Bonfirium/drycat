import TabMenu from 'components/tab-menu';
import ThemeSettings, { menu as themeMenu } from 'components/theme-settings';
import GlobalSettings, { menu as globalMenu } from 'components/global-settings';
import SideMenu from 'components/side-menu';



// import TabMenuArea from 'components/tab-menu/area';
// const heck = () => setTimeout(() => {
//   console.log('send');
//   IPC.send('test', { params: ['heck', 'yeah'] });
//   heck();
// }, 1000)


const App = () => {
  const items = [
    globalMenu,
    themeMenu,
  ];
  // heck();
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
