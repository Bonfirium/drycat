import React from 'react';

function GlobalSettings() {
  return (
    <div>
      Global Settings Tab
    </div>
  );
}

export default GlobalSettings;

export const menu = {
  label: "Global",
  subitems: [
    { label: "Shit", element: <GlobalSettings /> },
  ],
};
