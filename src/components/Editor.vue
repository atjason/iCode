<template>
  <codemirror :value="value" @input="update" :options="Object.assign(cmOption, {mode})"></codemirror>
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
      value: String,
      mode: String,
    },
    data: function() {
      return {
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
</style>
