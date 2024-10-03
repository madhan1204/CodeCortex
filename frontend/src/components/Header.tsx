import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6">Load Capacity Prediction</Typography>
    </Toolbar>
  </AppBar>
);

const Sidebar = () => (
  <Drawer variant="permanent">
    <List>
      <ListItem button component={RouterLink as React.ElementType} to="/">
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem
      button
      component={RouterLink as React.ElementType}  // Casting to ElementType for compatibility
      to="/predict"
      >
    <ListItemText primary="Predict" />
  </ListItem>
    </List>
  </Drawer>
);

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <main style={{ padding: '20px', marginLeft: '240px' }}>
      {children}
    </main>
  </div>
);

export default Layout;
