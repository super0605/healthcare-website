const path = require('path');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const AntDesignThemePluginVariablesToChange = require('../../libs/shared/theme/src/styles/variablesToChange.js');
const AntDesignThemePluginOptions = {
  antdStylesDir: path.join(__dirname, '../../node_modules/ng-zorro-antd'),
  stylesDir: path.join(__dirname, './src/assets/styles/'),
  varFile: path.join(__dirname, './src/assets/styles/app-variables.less'),
  mainLessFile: path.join(__dirname, './src/assets/styles/theme.less'),
  themeVariables: AntDesignThemePluginVariablesToChange,
  indexFileName: 'index.html',
  generateOnce: false,
  lessUrl: 'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js'
};

module.exports = {
  plugins: [new AntDesignThemePlugin(AntDesignThemePluginOptions)]
};
