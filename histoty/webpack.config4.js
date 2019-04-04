//webpack配置文件，在复杂项目中，可以简化很多在终端的大量代码
//webpack是node写出来的，需要node的写法p
//plugin和loader都需要npm install --save-dev
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');    //用插件自动输出html文件
let MiniCssExtractPlugin = require('mini-css-extract-plugin');   //抽离CSS文件的插件,link标签
let OptimizeCSS = require('optimize-css-assets-webpack-plugin');  //压缩CSS文件的插件，，插件的名称去npm官网查文档
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    optimization:{  //优化项
        // minimizer:[
        //     new UglifyJsPlugin({    //如果用了css的优化插件，就一定要用js的插件，不然只会优化CSS
        //         cache:true,
        //         parallel:true,    //是否并发打包
        //         sourceMap:true     //ES6映射到ES5
        //     }),
        //     new OptimizeCSS()
        // ]

    },
    devServer:{  //开发服务器的配置
        port:3000,
        progress:true,
        contentBase:'./dist',    //默认执行的文件夹运行静态服务
        compress:true      //启动压缩
    },
    mode:"development",   //模式，有两种production development,上线的时候会压缩代码
    entry:"./src/index.js",  //入口路径+文件名称
    output:{
        path:path.resolve(__dirname,'dist'),   //出口路径（绝对路径），绝对路径一定要写全，包裹的全部文件夹都要写。
                                                //出口文件名称,__dirname表示在当前目录下产生一个dist
        filename:'bundle.js'   //如果想要每次改动重新打包的时候生成一个新文件，防止缓存问题，可以用bundle.[hash].js。
        //如果希望哈希戳短一点，可以用bundle.[hash：8].js，只显示8位
    },
    plugins:[//数组，放着所有的webpack插件,插件都是类，插件没有先后顺序的
        new HtmlWebpackPlugin({
           template:'./src/index.html',     //说明输出文件以什么为模板
           filename:'index.html',        //打包后输出文件的名字
           minify:{  //最小化，也就是压缩文件
               removeAttributeQuotes:true,     //build的时候删除HTML文件中的双引号
               collapseWhitespace:true,    //折叠空格
           },
        //    hash:true,     //生成哈希戳，有利于缓存，也就是src后的文件名再加个问号，再加一些随机值

        }),
        new MiniCssExtractPlugin({    //extract是提取的意思
            filename:'main.css',
        }),
        // new webpack.ProvidePlugin({   //在每个模块中都注入$服务
        //     $:'jquery'
        // })
    ],
    module:{  //模块
        
        rules:[
            // {
            //     test:require.resolve('jquery'),
            //     use:'expose-loader?$'
            // },


            // {         //生产环境时执行
            //     test:/\.js$/,
            //     use:{
            //         //从eslint.org/demo网站下载.eslint.json文件，放到根目录下
            //         loader:'eslint-loader',         //校验js语法规范  npm install eslint eslint-loader --save-dev
            //         options:{
            //             enforce:'pre'            //强制优先执行
            //         }
            //     }
            // },
            {
                test:/\.js$/,        //普通的Loader
                use:{
                    loader:'babel-loader',
                    options:{   //用babel-loader把es6->es5
                        presets:[
                            '@babel/preset-env'
                        ],
                        plugins:[    //babel官网的配置   
                            //npm install --save-dev @babel/plugin-proposal-decorators,装饰符的插件
                             ["@babel/plugin-proposal-decorators", { "legacy": true }],   
                             ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                             "@babel/plugin-transform-runtime"   //运行时的依赖
                        ]
                    }
                },
                include:path.resolve(__dirname, 'src'),   //包括哪些文件
                exclude:/node_modules/                       //排除哪些文件
            },
            {    
                //loader的特点：希望单一,要先用npm install css-loader style-loader --save-dev 安装
                //loader的用法：字符串只用一个loader， 多个loader写成数组
                //loader的顺序：默认是从右向左执行,从下到上执行
                //loader还可以写成 对象方式,这种方式可以增加一个option参数
                
                test:/\.css$/,      //匹配以CSS结尾的文件,正则表达式两个斜杠外面不用加引号！
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]       //css-loader,负责解析@import这种语法,解析路径

            },
            {
                //可以处理less文件 处理sass stylus文件， 选安装node-sass  sass-loader  stylus stylus-loader
                test:/\.less$/,
                use:[
                    MiniCssExtractPlugin.loader,        //抽离出来放在同一个文件，都叫main.css
                    //如果less和css文件想输出成两个文件，需要引入两次插件，new两次
                    'css-loader',
                    'postcss-loader',    //自动添加浏览器前缀的模块
                    'less-loader'            //把less -> css   要同时安装less和less-loader 
                ]
            }
        ]

    }

}