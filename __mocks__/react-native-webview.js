const React = require('react');
const { View } = require('react-native');

const WebView = React.forwardRef((props, ref) => {
  return React.createElement(View, { ...props, ref });
});

module.exports = {
  WebView,
  default: WebView,
};
