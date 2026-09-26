const React = require('react');
const { View } = require('react-native');

const Drawer = ({ children, renderDrawerContent, ...props }) => {
  return React.createElement(View, props, children);
};

module.exports = {
  Drawer,
  DrawerGestureContext: React.createContext(null),
};
