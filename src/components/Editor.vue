<template>
  <div class="edit-container">
    <span class="panel-title" v-show="focused">{{ title }}</span>
    <codemirror
      class="editor"
      :value="value" 
      @input="update" 
      @focus="focused = true" 
      @blur="focused = false" 
      :options="Object.assign(cmOption, { mode, autofocus: title === 'html' })"
      :placeholder="title + ' code here.'"
    ></codemirror>
  </div>
</template>

<script>
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/xml/xml.js'
  import 'codemirror/mode/css/css.js'
  import 'codemirror/addon/display/placeholder.js'
  import 'codemirror/addon/selection/active-line.js'

  export default {
    props: {
      title: String,
      value: String,
      mode: String,
    },
    data: function() {
      return {
        focused: false,
        cmOption: {
          tabSize: 2,
          styleActiveLine: true,
        },
      }
    },
    components: {
      codemirror
    },
    methods: {
      update: function(newValue) {
        this.$emit('update', newValue)
      }
    }
  }
</script>

<style scoped>
  .edit-container,
  .editor {
    width: 100%;
    height: 100%;
  }

  .panel-title {
    position: absolute;
    top: 5px;
    right: 6px;
    margin: 4px;
    padding: 1px 4px 1px 5px;

    font-size: 0.85rem;

    color: gray;
    background-color: white;
    border: solid 1px rgb(209, 227, 250);
    border-radius: 4px;

    z-index: 2;
  }
</style>

<style>
  .CodeMirror {
    font-size: 1.1rem;
    height: 100%;
    background-color: #D2D2D2;
    transition: background-color 0.3s ease;
  }
  .CodeMirror-focused {
    background-color: white;
  }
  .CodeMirror-lines { 
    padding: 10px;
  }
  .CodeMirror-focused .CodeMirror-activeline-background {
    background-color: #E8F2FF;
    /* background-color: white;
    border: solid 1px #EEE; */
  }
  .CodeMirror-activeline-background {
    background-color: #D2D2D2;
    transition: background-color 0.3s ease;
  }
  .CodeMirror-empty { 
    color: darkgray;
  }
  .CodeMirror-empty.CodeMirror-focused {
    color: lightgray; 
  }
</style>
