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
        <code-editor :value="htmlStr" mode='xml' @update="value => htmlStr = value"></code-editor>
      </div>
  
      <div class="separator separator-vertical" @mousedown="onDragStart('left')"></div>

      <div class="js-container" :class="{ hide: !showJS }" :style="{ 'flex-basis': `calc(100% - ${htmlHeight})` }">
        <span class="panel-title">js</span>
        <code-editor :value="jsStr" mode='js' @update="value => jsStr = value"></code-editor>
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
        <code-editor :value="cssStr" mode='css' @update="value => cssStr = value"></code-editor>
      </div>

      <div class="separator separator-vertical" @mousedown="onDragStart('right')" @mousemove="onDragging"></div>
      
      <div class="iframe-container" :class="{ hide: !showPreview }" :style="{ 'flex-basis': `calc(100% - ${cssHeight})` }">
        <html-preview ref='htmlPreview' :html-str='htmlStr' :js-str='jsStr' :css-str='cssStr'></html-preview>
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

  import codeEditor from './components/Editor.vue'
  import htmlPreview from './components/Preview.vue'

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

        cmOption: {
          tabSize: 2,
          styleActiveLine: true,
        },
      }
    },
    components: {
      codeEditor,
      htmlPreview,
    },
    mounted: function() {
      var code = codeStorage.fetch()
      keyList.forEach(key => this[key] = code[key])
      setTimeout(() => {
        this.render()
      }, 300)
      
      document.onkeydown = this.onKeyDown
    },
    watch: {
      htmlStr:  function() { codeStorage.save({ htmlStr: this.htmlStr }) },
      cssStr:   function() { codeStorage.save({ cssStr: this.cssStr }) },
      jsStr:    function() { codeStorage.save({ jsStr: this.jsStr}) },
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
      render: function() {
        this.$refs.htmlPreview.render()
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
