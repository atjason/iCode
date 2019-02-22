<template>
  <div class="page" id="app">
    <div class="left-container" 
        @mousemove="onDragging"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd('leave')"
        :style="{ 'flex-basis': leftWidth }"
      >

      <div class="html-container" :class="{ hide: !showHtml }" :style="{ 'flex-basis': htmlHeight }">
        <span class="panel-title">html</span>
        <editor :value="htmlStr" mode='xml' @update="value => htmlStr = value"></editor>
      </div>
  
      <div class="separator separator-vertical" @mousedown="onDragStart('left')"></div>

      <div class="js-container" :class="{ hide: !showJS }" :style="{ 'flex-basis': `calc(100% - ${htmlHeight})` }">
        <span class="panel-title">js</span>
        <editor :value="jsStr" mode='js' @update="value => jsStr = value"></editor>
      </div>      
    </div>

    <div class="separator separator-horizotal" @mousedown="onDragStart('middle')" @mouseup="onDragEnd"></div>

    <div class="right-container"
        @mousemove="onDragging"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd('leave')"
        :style="{ 'flex-basis': `calc(100% - ${leftWidth})` }"
      >
      <div class="css-container" :class="{ hide: !showCSS }" :style="{ 'flex-basis': cssHeight }">
        <span class="panel-title">css</span>
        <editor :value="cssStr" mode='css' @update="value => cssStr = value"></editor>
      </div>

      <div class="separator separator-vertical" @mousedown="onDragStart('right')" @mousemove="onDragging"></div>
      
      <div class="iframe-container" :class="{ hide: !showPreview }" :style="{ 'flex-basis': `calc(100% - ${cssHeight})` }">
        <iframe id='iframe'></iframe>
      </div>      
    </div>
  </div>
</template>

<script>

  var StorageKeyPrefix = 'CodeHere_'
  var keyList = ['htmlStr', 'cssStr', 'jsStr', 'htmlHeight', 'cssHeight', 'leftWidth']
  var codeStorage = {
    fetch: function() {
      var code = {}
      for (let key of keyList) {
        code[key] = localStorage.getItem(StorageKeyPrefix + key) || ''
      }
      return code
    },
    save: function(obj) {
      if (!obj) return
      for (let key in obj) {
        localStorage.setItem(StorageKeyPrefix + key, obj[key])
      }
    }
  }

  import editor from './components/Editor.vue'

  export default {
    data: function(){
      return {
        htmlStr: '',
        cssStr: '',
        jsStr: '',
        htmlHeight: '50%',
        cssHeight: '50%',
        leftWidth: '50%',
        showHtml: true,
        showCSS: true,
        showJS: true,
        showPreview: true,
        draggingSeparator: '',
        autoRender: false,

        cmOption: {
          tabSize: 2,
          styleActiveLine: true,
        },
      }
    },
    components: {
      editor,
    },
    mounted: function() {
      var code = codeStorage.fetch()
      keyList.forEach(key => this[key] = code[key])
      this.render()
      
      document.onkeydown = this.onKeyDown
    },
    watch: {
      htmlStr:  function() { this.saveAndRender({ htmlStr: this.htmlStr }) },
      cssStr:   function() { this.saveAndRender({ cssStr: this.cssStr }) },
      jsStr:    function() { this.saveAndRender({ jsStr: this.jsStr}) },
    },
    methods: {
      onKeyDown: function(e) {
        if (!e.metaKey) return

        switch(e.key) {
          case '1': this.showHtml     = !this.showHtml; break;
          case '2': this.showJS       = !this.showJS; break;
          case '3': this.showCSS      = !this.showCSS; break;
          case '4': this.showPreview  = !this.showPreview; break;
          case 'Enter': this.render(); break;
          default: break;
        }

        if (['1', '2', '3', '4', 'Enter'].indexOf(e.key) >= 0) {
          e.preventDefault()
        }
      },
      onDragStart: function(draggingSeparator) {
        this.draggingSeparator = draggingSeparator
      },
      onDragging: function(e) {
        if (this.draggingSeparator === 'left') {
          this.htmlHeight = e.y + 'px'
        } if (this.draggingSeparator === 'right') {
          this.cssHeight = e.y + 'px'
        } if (this.draggingSeparator === 'middle') {
          this.leftWidth = e.x + 'px'
        }
      },
      onDragEnd: function(source) {
        if (this.draggingSeparator !== 'middle' || (this.draggingSeparator && source !== 'leave')) {
          var map = {
            left: 'htmlHeight',
            right: 'cssHeight',
            middle: 'leftWidth',
          }
          var key = map[this.draggingSeparator]
          codeStorage.save({[key]: this[key]})

          this.draggingSeparator = ''
        }
      },
      saveAndRender: function(obj) {
        codeStorage.save(obj)
        if (this.autoRender) this.render()
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
  * {
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
  }

  .page {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;

    display: flex;
    flex-wrap: nowrap;
  }

  .left-container,
  .right-container {
    flex-basis: 50%;
    flex-grow: 2;
    height: 100vh;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .html-container,
  .css-container,
  .js-container,
  .iframe-container {
    flex-basis: 50%;
    flex-grow: 2;
    position: relative;

    background-color: #D2D2D2;
  }

  .separator {
    background: #AAA;
  }

  .separator-horizotal {
    width: 1px;
    background: transparent;
    cursor: ew-resize;
    border-right: solid 1px #AAA;
  }

  .separator-vertical {
    height: 1px;
    cursor: ns-resize;
  }

  .separator-horizotal::after,
  .separator-vertical::after {
    content: "";
    display: block;
    position: relative;
  }

  .separator-horizotal::after {
    height: 100%;
    width: 6px;
    left: -2px;
  }

  .separator-vertical::after {
    width: 100%;
    height: 6px;
    top: -2px;
  }

  iframe {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  iframe {
    border: none;
  }

  .panel-title {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 2px 5px;

    color: #F0F0F0;
    background-color: #1285DA;
    border-radius: 4px;
    opacity: 0.3;

    z-index: 2;
    display: none;
  }

  .hide {
    display: none;
  }
</style>
