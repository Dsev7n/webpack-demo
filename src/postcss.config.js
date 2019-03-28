
//调用postcss-loader默认会执行这个配置文件，没有这个文件会报错
module.exports = {
    plugins:[require('autoprefixer')]
}