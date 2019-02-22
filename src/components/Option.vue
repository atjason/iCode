<template>
  <div id="option" class="mask" @click.self="$emit('close')">
    <div class="container">
      <h3>Behavior</h3>
      <input type="checkbox" v-model="autoRender">
      <span>Auto-run code.</span>

      <div class="separator"></div>

      <h3>Shortcuts</h3>
      <table>
        <tbody>
          <tr v-for="shortcut in shortcuts" :key="shortcut.key">
            <td class='td-shortcut td-shortcut-key'>
              <span class='shortcut-key'>{{ shortcut.key }}</span>
            </td>
            <td class='td-shortcut'>
              <span>{{ shortcut.description }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import CodeStorage from '../utils/util.js'

  export default {
    data: function() {
      return {
        autoRender: false,
        shortcuts: [
          { key: '⌘1', description: 'Show or hide the html editor.' },
          { key: '⌘2', description: 'Show or hide the js editor.' },
          { key: '⌘3', description: 'Show or hide the css editor.' },
          { key: '⌘4', description: 'Show or hide the previewer.' },
          { key: '⌘Enter', description: 'Manually run code.' },
        ]
      }
    },
    mounted: function() {
      let autoRender = CodeStorage.fetch('autoRender')
      if (autoRender === undefined) {
        autoRender = true
        Vue.prototype.$options.autoRender = true
      } else {
        autoRender = (autoRender == 'true')
      }
      this.autoRender = autoRender
    },
    watch: {
      autoRender: function() {
        CodeStorage.save({ autoRender: this.autoRender })
        Vue.prototype.$options.autoRender = this.autoRender
      },
    },
  }
</script>

<style scoped>
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    color: #333;
    background-color: rgba(0, 0, 0, 0.2);

    z-index: 10;
  }

  .container {
    padding: 8px 25px 25px 25px;
    margin: 0;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0 0 1px rgba(57,70,78,.15), 0 20px 55px -8px rgba(57,70,78,.25);
  }

  .separator {
    height: 1px;
    width: 100%;
    margin-top: 15px;
    border-bottom: solid 1px #E1E3E4;
  }
  
  .td-shortcut {
    padding: 4px;
  }

  .td-shortcut-key {
    text-align: right;
  }

  .shortcut-key {
    font-family: monospace;
    font-weight: bold;
    padding: 2px 4px;
    border: solid 1px lightgray;
    border-radius: 4px;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  }
</style>
