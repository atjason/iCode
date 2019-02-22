<template>
  <iframe id='iframe'></iframe>
</template>

<script>
  import CodeStorage from '../utils/util.js'

  export default {
    props: {
      htmlStr: String,
      cssStr: String,
      jsStr: String,
    },
    data: function() {
      return {
        autoRender: CodeStorage.fetch('autoRender'),
      }
    },
    watch: {
      htmlStr:  function() { this.renderIfNecessary() },
      cssStr:   function() { this.renderIfNecessary() },
      jsStr:    function() { this.renderIfNecessary() },
    },
    methods: {
      renderIfNecessary: function() {
        if (this.autoRender) this.render();
      },
      render: function() {
        var htmlSource = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta http-equiv="content-type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
            <style> body { font-family: sans-serif; }</style>
            <style>${this.cssStr}</style>
          </head>
          <body>
            ${this.htmlStr || `<span style="color: #888">Preview here.</span>`}
            <script>${this.jsStr}<\/script>
          </body>
          </html>
        `
        var iframeDoc = document.getElementById('iframe').contentDocument
        iframeDoc.open()
        iframeDoc.write(htmlSource)
        iframeDoc.close()
      }
    }
  }
</script>

<style>
  iframe {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
