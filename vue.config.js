
const isDev = (process.env.NODE_ENV === 'development')

module.exports = {
  publicPath: isDev ? '/' : '/editor/',
  productionSourceMap: isDev,
  configureWebpack: config => {
    config.devtool = isDev ? 'source-map' : false
    if (!isDev) {
      config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'codemirror': 'CodeMirror'
      }
    }
  }
}
