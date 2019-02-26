<template>
  <div class="page">
    <div class="left-container" :class="{ hide: !showHtml && !showJS }"
        @mousemove="onDragging"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd('leave')"
        :style="{ 'flex-basis': leftWidth }"
      >

      <div class="html-container" :class="{ hide: !showHtml }" :style="{ 'flex-basis': htmlHeight }">
        <code-editor :value="htmlStr" mode='xml' title='html' @update="value => htmlStr = value"></code-editor>
      </div>
  
      <div class="separator separator-vertical" @mousedown="onDragStart('left')"></div>

      <div class="js-container" :class="{ hide: !showJS }" :style="{ 'flex-basis': `calc(100% - ${htmlHeight})` }">
        <code-editor :value="jsStr" mode='javascript' title='js' @update="value => jsStr = value"></code-editor>
      </div>      
    </div>

    <div class="separator separator-horizotal" @mousedown="onDragStart('middle')" @mouseup="onDragEnd"></div>

    <div class="right-container" :class="{ hide: !showCSS && !showPreview }"
        @mousemove="onDragging"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd('leave')"
        :style="{ 'flex-basis': `calc(100% - ${leftWidth})` }"
      >
      <div class="css-container" :class="{ hide: !showCSS }" :style="{ 'flex-basis': cssHeight }">
        <code-editor :value="cssStr" mode='css' title='css' @update="value => cssStr = value"></code-editor>
      </div>

      <div class="separator separator-vertical" @mousedown="onDragStart('right')" @mousemove="onDragging"></div>
      
      <div class="iframe-container" :class="{ hide: !showPreview }" :style="{ 'flex-basis': `calc(100% - ${cssHeight})` }">
        <html-preview 
          ref='htmlPreview' 
          :html-str='htmlStr' :js-str='jsStr' :css-str='cssStr' 
          :disable-mouse="Boolean(draggingSeparator)">
        </html-preview>
      </div>
    </div>

    <option-modal v-if="showOptions" @close="showOptions = false"></option-modal>
    <img class="option" src="./assets/option.png" @click="showOptions = true">
  </div>
</template>

<script>
  import codeEditor from './components/Editor.vue'
  import htmlPreview from './components/Preview.vue'
  import optionModal from './components/Option.vue'
  import CodeStorage from './utils/code-storage.js'
  import store from './store'

  let lastActiveElement

  export default {
    store,
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
        showOptions: false,
      }
    },
    components: {
      codeEditor,
      htmlPreview,
      optionModal,
    },
    mounted: function() {
      const allItems = CodeStorage.fetchAll()
      for (let key in allItems) {
        this[key] = allItems[key]
      }

      setTimeout(() => {
        this.render()
      }, 600)
      
      document.onkeydown = this.onKeyDown
    },
    watch: {
      htmlStr:  function() { CodeStorage.save({ htmlStr: this.htmlStr || '' }) },
      cssStr:   function() { CodeStorage.save({ cssStr: this.cssStr || '' }) },
      jsStr:    function() { CodeStorage.save({ jsStr: this.jsStr || '' }) },
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
        lastActiveElement = document.activeElement
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
        if (!this.draggingSeparator) return

        if (this.draggingSeparator !== 'middle' || source !== 'leave') {
          const map = {
            left: 'htmlHeight',
            right: 'cssHeight',
            middle: 'leftWidth',
          }
          const key = map[this.draggingSeparator]
          if (key) CodeStorage.save({[key]: this[key]})

          this.draggingSeparator = ''
          if (lastActiveElement) lastActiveElement.focus()
        }
      },

      render: function() {
        this.$refs.htmlPreview.render()
      },
    }
  }
</script>

<style scoped>
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

  .hide {
    display: none;
  }

  .option {
    position: fixed;
    right: 10px;
    bottom: 10px;
    width: 40px;
    height: 40px;
    padding: 10px;

    cursor: pointer;
    opacity: 0.5;
    transition: all 0.5s ease;
  }

  .option:hover {
    opacity: 1;
    transform: scale(1.4);
  }
</style>
