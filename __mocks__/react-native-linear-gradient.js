const React = require('react');
const { View } = require('react-native');

const LinearGradient = React.forwardRef((props, ref) => {
  return React.createElement(View, { ...props, ref });
});

module.exports = LinearGradient;
module.exports.default = LinearGradient;
