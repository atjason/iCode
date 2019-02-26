
const isDev = (process.env.NODE_ENV === "development")

module.exports = {
  publicPath: isDev ? '/' : '/editor/',
  productionSourceMap: isDev ? true : false,
  configureWebpack: {
    devtool: isDev ? 'source-map' : false
  }
}