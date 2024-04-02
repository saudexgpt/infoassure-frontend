<template>
  <div>
    <div>
      <el-button
        type="primary"
        @click="exportBlob"
      >
        Save
      </el-button>
    </div>
    <div>
      <ejs-toolbar>
        <e-items>
          <e-item
            id="bold"
            prefix-icon="e-de-icon-Bold"
            tooltip-text="Bold"
          />
          <e-item
            id="italic"
            prefix-icon="e-de-icon-Italic"
            tooltip-text="Italic"
          />
          <e-item
            id="underline"
            prefix-icon="e-de-icon-Underline"
            tooltip-text="Underline"
          />
          <e-item
            id="strikethrough"
            prefix-icon="e-de-icon-Strikethrough"
            tooltip-text="Strikethrough"
          />
          <e-item
            id="subscript"
            prefix-icon="e-de-icon-Subscript"
            tooltip-text="Subscript"
          />
          <e-item
            id="superscript"
            prefix-icon="e-de-icon-Superscript"
            tooltip-text="Superscript"
          />
          <e-item type="Seperator" />
          <e-item
            type="Input"
          >
            <template>
              <ejs-colorpicker
                value="#000000"
                :show-buttons="true"
                v:bind:change="onFontColorChange"
              />
            </template>
          </e-item>
          <e-item type="Seperator" />
          <e-item
            type="Input"
          >
            <template>
              <ejs-combobox
                :data-source="fontStyle"
                :width="120"
                :index="2"
                :allow-custom="true"
                v:bind:change="onFontFamilyChange"
                :show-clear-button="false"
              />
            </template>
          </e-item>
          <e-item
            type="Input"
          >
            <ejs-combobox
              :data-source="fontSize"
              :width="80"
              :index="2"
              :allow-custom="true"
              v:bind:change="onFontSizeChange"
              :show-clear-button="false"
            />
          </e-item>
        </e-items>
      </ejs-toolbar>
    </div>
    <ejs-documenteditor
      ref="documenteditor"
      :service-url="serviceUrl"
      :enable-toolbar="true"
      :enable-sfdt-export="true"
      :enable-word-export="true"
      :enable-selection="true"
      :enable-editor-history="true"
      :enable-editor="true"
      :enable-print="true"
      :is-read-only="false"
      style="width: 100%;"
      @selection-change="onSelectionChange"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import {
  DocumentEditorPlugin, Editor, Selection, EditorHistory, SfdtExport, WordExport,
} from '@syncfusion/ej2-vue-documenteditor'
// eslint-disable-next-line import/no-unresolved
import { ToolbarPlugin } from '@syncfusion/ej2-vue-navigations'
// eslint-disable-next-line import/no-unresolved
import { ColorPickerPlugin } from '@syncfusion/ej2-vue-inputs'
// eslint-disable-next-line import/no-unresolved
import { ComboBoxPlugin } from '@syncfusion/ej2-vue-dropdowns'
// eslint-disable-next-line import/no-extraneous-dependencies
import '@syncfusion/ej2-buttons/styles/material.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import '@syncfusion/ej2-inputs/styles/material.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import '@syncfusion/ej2-popups/styles/material.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import '@syncfusion/ej2-lists/styles/material.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import '@syncfusion/ej2-navigations/styles/material.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import '@syncfusion/ej2-splitbuttons/styles/material.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import '@syncfusion/ej2-dropdowns/styles/material.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import '@syncfusion/ej2-base/styles/material.css'

Vue.use(DocumentEditorPlugin)
Vue.use(ToolbarPlugin)
Vue.use(ColorPickerPlugin)
Vue.use(ComboBoxPlugin)
export default {
  data() {
    return {
      serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/',
      fontStyle: ['Algerian', 'Arial', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Courier New', 'Georgia', 'Impact', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Symbol', 'Times New Roman', 'Verdana', 'Windings'],
      fontSize: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72', '96'],
    }
  },
  provide: {
    // Inject require modules.
    DocumentEditor: [Editor, Selection, EditorHistory, SfdtExport, WordExport],
  },
  // mounted() {
  //   this.$refs.documenteditor.ej2Instances.editor.insertTable(2, 2)
  // },
  methods: {
    exportBlob() {
      console.log(this.$refs.documenteditor)
      // Export the document as Blob object.
      this.$refs.documenteditor.saveAsBlob('Docx').then(exportedDocument => {
        // The blob can be processed further
        console.log(exportedDocument)
      })
    },
    toolbarButtonClick(arg) {
      switch (arg.item.id) {
        case 'bold':
          // Toggles the bold of selected content
          this.$refs.documenteditor.ej2Instances.editor.toggleBold()
          break
        case 'italic':
          // Toggles the Italic of selected content
          this.$refs.documenteditor.ej2Instances.editor.toggleItalic()
          break
        case 'underline':
          // Toggles the underline of selected content
          this.$refs.documenteditor.ej2Instances.editor.toggleUnderline('Single')
          break
        case 'strikethrough':
          // Toggles the strikethrough of selected content
          this.$refs.documenteditor.ej2Instances.editor.toggleStrikethrough()
          break
        case 'subscript':
          // Toggles the subscript of selected content
          this.$refs.documenteditor.ej2Instances.editor.toggleSubscript()
          break
        case 'superscript':
          // Toggles the superscript of selected content
          this.$refs.documenteditor.ej2Instances.editor.toggleSuperscript()
          break
        default:
          break
      }
    },
    onFontFamilyChange(args) {
      this.$refs.documenteditor.ej2Instances.selection.characterFormat.fontFamily = args.value
      this.$refs.documenteditor.focusIn()
    },
    onFontSizeChange(args) {
      this.$refs.documenteditor.ej2Instances.selection.characterFormat.fontSize = args.value
      this.$refs.documenteditor.focusIn()
    },
    onFontColorChange(args) {
      this.$refs.documenteditor.ej2Instances.selection.characterFormat.fontColor = args.currentValue.hex
      this.$refs.documenteditor.focusIn()
    },
    onSelectionChange() {
      const characterformat = this.$refs.documenteditor.ej2Instances.selection.characterFormat
      const properties = [characterformat.bold, characterformat.italic, characterformat.underline, characterformat.strikeThrough]
      const toggleBtnId = ['bold', 'italic', 'underline', 'strikethrough']
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < properties.length; i++) {
        const toggleBtn = document.getElementById(toggleBtnId[i])
        if ((typeof (properties[i]) === 'boolean' && properties[i] === true) || (typeof (properties[i]) === 'string' && properties[i] !== 'None')) toggleBtn.classList.add('e-btn-toggle')
        else if (toggleBtn.classList.contains('e-btn-toggle')) toggleBtn.classList.remove('e-btn-toggle')
      }
    },
  },
}
</script>
