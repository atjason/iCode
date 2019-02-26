
const isDev = (process.env.NODE_ENV === 'development')

module.exports = {
  publicPath: isDev ? '/' : '/editor/',
  productionSourceMap: isDev,
  configureWebpack: {
    devtool: isDev ? 'source-map' : false
  }
}
