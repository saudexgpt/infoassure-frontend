<template>
  <div v-loading="loading">
    <div>
      <el-tooltip class="item" effect="dark" content="Save" placement="top-start">
        <el-button type="success" size="mini" @click="save">
          <feather-icon icon="SaveIcon" />
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Download" placement="top-start">
        <el-button type="primary" size="mini">
          <feather-icon icon="DownloadIcon" />
        </el-button>
      </el-tooltip>
    </div>
    <ejs-spreadsheet>
      <e-sheets>
        <e-sheet>
          <e-ranges>
            <e-range :dataSource="data" />
          </e-ranges>
        </e-sheet>
      </e-sheets>
    </ejs-spreadsheet>
    <!-- <ejs-spreadsheet
      ref="spreadsheet"
      height="750px"
      :open-url="openUrl"
      :allow-open="true"
      :save-url="saveUrl"
      :created="created"
    /> -->
  </div>
</template>

<script>
import {
  SpreadsheetComponent,
  RangesDirective,
  RangeDirective,
  SheetsDirective,
  SheetDirective
} from '@syncfusion/ej2-vue-spreadsheet'
// import Resource from '@/api/resource'
export default {
  components: {
    'ejs-spreadsheet': SpreadsheetComponent,
    'e-sheets': SheetsDirective,
    'e-sheet': SheetDirective,
    'e-ranges': RangesDirective,
    'e-range': RangeDirective
  },
  props: {
    documentPath: {
      type: String,
      default: ''
    },
    documentTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      openUrl: 'https://services.syncfusion.com/vue/production/api/spreadsheet/open',
      saveUrl: 'https://services.syncfusion.com/vue/production/api/spreadsheet/save',
      loading: false
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  methods: {
    save() {
      this.$refs.spreadsheet.saveAsJson().then((response) => {
        console.log(response)
      })
    },
    created() {
      this.loading = true
      // 'https://cdn.syncfusion.com/scripts/spreadsheet/Sample.xlsx'
      // fetch(`${this.baseServerUrl}storage/${this.documentPath}`, options)
      fetch(`${this.baseServerUrl}storage/${this.documentPath}`) // fetch the remote url
        .then((response) => {
          console.log(response)
          this.loading = false
          response.blob().then((fileBlob) => {
            // convert the excel file to blob
            const file = new File([fileBlob], 'Sample.xlsx') // convert the blob into file
            this.$refs.spreadsheet.open({ file }) // open the file into Spreadsheet
          })
        })
        .catch((this.loading = false))
    }
  }
}
</script>
<style>
@import '../../../styles/ej2-base/buttons.css';
@import '../../../styles/ej2-base/inputs.css';
@import '../../../styles/ej2-base/popups.css';
@import '../../../styles/ej2-base/lists.css';
@import '../../../styles/ej2-base/navigations.css';
@import '../../../styles/ej2-base/splitbuttons.css';
@import '../../../styles/ej2-base/dropdowns.css';
@import '../../../styles/ej2-base/base.css';
@import '../../../styles/ej2-base/doc-editor-material.css';
@import '../../../styles/ej2-base/grids.css';
@import '../../../styles/ej2-base/spreadsheet.css';
</style>
