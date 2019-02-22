<template>
  <div>
    <span class="panel-title" v-show="focused">{{ title }}</span>
    <codemirror 
      :value="value" 
      @input="update" 
      @focus="focused = true" 
      @blur="focused = false" 
      :options="Object.assign(cmOption, { mode })"
    ></codemirror>
  </div>
</template>

<script>
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/xml/xml.js'
  import 'codemirror/mode/css/css.js'
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

<style>
  .CodeMirror {
    font-size: 1.1rem;
    background-color: #D2D2D2;
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
  }

  .panel-title {
    position: absolute;
    top: 4px;
    right: 4px;
    margin: 4px;
    padding: 2px 5px;

    color: gray;
    background-color: white;
    border: solid 1px rgb(209, 227, 250);
    border-radius: 4px;

    z-index: 2;
  }
</style>
