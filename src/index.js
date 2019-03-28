let str = require('./a.js');

require('./index.css');   //webpack默认只打包js文件，在HTML中引入不生效
require('./index.less');