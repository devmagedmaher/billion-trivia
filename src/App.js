import React from 'react'
import './App.css';
import Router from './router'
import { MantineProvider } from '@mantine/core';
import theme from './theme';

function App() {
  React.useEffect(() => {
    if (!localStorage.getItem('id')) {
      localStorage.setItem('id', `${Math.floor(Math.random() * 1000)}${Date.now()}`)
    }
  }, [])
  
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <Router />
    </MantineProvider>
  );
}

export default App;
