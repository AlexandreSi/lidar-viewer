const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const { style } = require('./src/theme/style')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: style,
  }),
);
