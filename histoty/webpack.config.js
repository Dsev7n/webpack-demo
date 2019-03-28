//webpack配置文件，在复杂项目中，可以简化很多在终端的大量代码
//webpack是node写出来的，需要node的写法p
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');    //用插件自动输出html文件
module.exports = {
    devServer:{  //开发服务器的配置
        port:3000,
        progress:true,
        contentBase:'./dist',    //默认执行的文件夹运行静态服务
        compress:true      //启动压缩
    },
    mode:"production",   //模式，有两种production development,上线的时候会压缩代码
    entry:"./src/index.js",  //入口路径+文件名称
    output:{
        path:path.resolve(__dirname,'dist'),   //出口路径（绝对路径），绝对路径一定要写全，包裹的全部文件夹都要写。
                                                //出口文件名称,__dirname表示在当前目录下产生一个dist
        filename:'bundle.[hash:8].js'   //如果想要每次改动重新打包的时候生成一个新文件，防止缓存问题，可以用bundle.[hash].js。
        //如果希望哈希戳短一点，可以用bundle.[hash：8].js，只显示8位
    },
    plugins:[//数组，放着所有的webpack插件,插件都是类
        new HtmlWebpackPlugin({
           template:'./src/index.html',     //说明输出文件以什么为模板
           filename:'index.html',        //打包后输出文件的名字
           minify:{  //最小化，也就是压缩文件
               removeAttributeQuotes:true,     //build的时候删除HTML文件中的双引号
               collapseWhitespace:true,    //折叠空格
           },
           hash:true,     //生成哈希戳，有利于缓存，也就是src后的文件名再加个问号，再加一些随机值

        })
    ],
    module:{  //模块
        
        rules:[
            {    
                //loader的特点：希望单一,要先用npm install css-loader style-loader --save-dev 安装
                //loader的用法：字符串只用一个loader， 多个loader写成数组
                //loader的顺序：默认是从右向左执行,从下到上执行
                //loader还可以写成 对象方式,这种方式可以增加一个option参数
                
                test:/\.css$/,      //匹配以CSS结尾的文件,正则表达式两个斜杠外面不用加引号！
                use:[{
                        loader:'style-loader',     //styloe-loader,负责把css插入到head标签中
                        options:{
                            insertAt:'top'     //外部加载的默认会把style放在head的最底部，会覆盖原本内联样式，如果想要内联样式优先级最高，就要增加这个配置
                        }
                    },
                    'css-loader']       //css-loader,负责解析@import这种语法,解析路径

            },
            {
                //可以处理less文件 处理sass stylus文件， 选安装node-sass  sass-loader  stylus stylus-loader
                test:/\.less$/,
                use:[{
                        loader:'style-loader',
                        options:{  
                            insertAt:'top'     //外部加载的默认会把style放在head的最底部，会覆盖原本内联样式，如果想要内联样式优先级最高，就要增加这个配置
                        }
                    },
                    'css-loader',
                    'less-loader'            //把less -> css   要同时安装less和less-loader 
                ]
            }
        ]

    }

}