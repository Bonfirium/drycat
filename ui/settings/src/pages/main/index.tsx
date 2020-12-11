import React from 'react';
import TabMenu from 'components/tab-menu';
import ThemeSettings from 'components/theme-settings';

const App = () => {

  function handleTabChange(index: number) {
    console.log("CHANGE!!!", index);
  }

  return (
    <div>
      <TabMenu
        onChange={handleTabChange}
        items={["Global settings", "Theme settings"]}
        choosedIndex={0}
      />
    </div>
  );
}

export default App;
