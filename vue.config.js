const webpack = require('webpack')

module.exports = {
  publicPath: './',
  assetsDir: './src/assets',
  // outputDir: '/Users/Fun/activityCode/activities-master/emoticon',
  outputDir: '/Users/yicao/mango/activities-master/emoticon',
  // outputDir: 'E:\\gitworkspace\\app.hitv.com-master\\2021-new-year',
  // transpileDependencies: ['swiper', 'dom7'],
  configureWebpack: {
    devServer: {
      disableHostCheck: true,
    },
    plugins: [
      // new webpack.ProvidePlugin({
      //   CanvasKeyFrames: 'canvaskeyframes',
      // }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
    ],
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 75, // 换算的基数
            selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
            propList: ['*'],
          }),
          require('autoprefixer')(),
        ],
      },
    },
  },
}
