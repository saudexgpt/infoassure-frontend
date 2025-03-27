<template>
  <div class="">
    <el-row
      :gutter="10"
      class="padded"
    >
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
      >
        <div style="background: #f0f0f0; color:#000000; padding: 10px;">
          <strong>Kindly follow the steps below to upload questions in bulk (per clause/requirement) from csv file.</strong>
          <ol>
            <li><code><a @click="handleDownload">Download CSV Format</a></code> to get the file format</li>
            <li>Open with a spreadsheet package, example Microsoft Excel package</li>
            <li>Leave the Table Header Names the way they are and <strong class="red">DO NOT MODIFY THEM</strong></li>
            <li>Fill the downloaded csv file accordingly as guided by the Header Names. Each row for an entry.</li>
            <li>Delete the three sample entries given to guide you and start from row number two (2) in the file.</li>
            <li>When done with all entries, SAVE your file with .csv (Comma delimited) file extension. <strong class="red">For example question_1.csv</strong></li>
            <li>Fill the form accordingly and select the file from where you saved</li>
            <li>Preview your work and click on SUBMIT if satisfied</li>
            <li>CONGRATULATIONS!!! You are done.</li>
          </ol>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
      >
        <b-row v-loading="loader">
          <b-col
            cols="12"
            class="mb-2"
          >
            <b-alert
              variant="primary"
              show
            >
              <div class="alert-body">
                <h5><strong>Fill the Form below</strong></h5>
              </div>
            </b-alert>
          </b-col>
          <b-col md="12">
            <upload-excel-component
              :on-success="handleSuccess"
            />
          </b-col>
        </b-row>
      </el-col>
    </el-row>
    <legend v-if="tableData.length > 0">
      Preview what you just uploaded and then click on the submit button. <a
        class="btn btn-success"
        @click="addBulkProductToStock"
      >SUBMIT</a>
    </legend>
    <div style="height: 600px; overflow:auto;">
      <el-table
        :data="tableData"
        border
        highlight-current-row
        style="width: 100%;margin-top:20px;"
      >
        <el-table-column
          v-for="item of tableHeader"
          :key="item"
          :prop="item"
          :label="item"
        />
      </el-table>
    </div>
    <legend v-if="tableData.length > 0">
      Click on the submit button. <a
        class="btn btn-success"
        @click="addBulkProductToStock"
      >SUBMIT</a>
    </legend>
  </div>

</template>

<script>
import {
  BAlert,
  BRow,
  BCol,
} from 'bootstrap-vue'
import UploadExcelComponent from '@/views/components/UploadExcel/index.vue'
import Resource from '@/api/resource'

export default {
  name: 'UploadBulk',
  components: {
    BAlert,
    BRow,
    BCol,
    UploadExcelComponent,
  },
  data() {
    return {
      fill_fields_error: false,
      tableData: [],
      tableHeader: [],
      form: {
        bulk_data: [],
      },
      clauses: [],
      loader: false,

    }
  },
  created() {
  },
  methods: {
    handleDownload() {
      // this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // const multiHeader = [['List of Products', '', '', '', '']];
        const tHeader = ['DOMAIN', 'QUESTION', 'KEY', 'ANSWER_TYPE', 'REQUIRES_EVIDENCE']
        // const filterVal = []
        // const list = [] // this.items
        const data = [
          ['Regulatory & Compliance Risk', 'Do you conduct regular compliance audits?', 'Upload latest audit report if applicable', 'both', 'yes'],
          ['Security & Data Protection Risk', 'Do you process or store sensitive customer or company data?', '', 'yes-no', 'no'],
          ['Security & Data Protection Risk', 'Do you have a formal cybersecurity policy?', 'Upload cybersecurity policy if applicable', 'yes-no', 'yes'],
        ]// this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          // multiHeader,
          header: tHeader,
          data,
          filename: 'BULK QUESTIONS SAMPLE FILE',
          autoWidth: true,
          bookType: 'csv',
        })
        // this.downloadLoading = false
      })
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      // console.log(results);
    },
    addBulkProductToStock() {
      const app = this
      const { form } = app
      form.bulk_data = app.tableData
      app.loader = true
      const uploadBulkStudents = new Resource('vdd/questions/upload-default-questions')
      uploadBulkStudents.store(form)
        .then(response => {
          app.tableData = response.unsaved_data
          if (app.tableData.length > 0) {
            app.$alert('Some data could not be uploaded. Possible cause may be duplicate questions')
          } else {
            app.tableHeader = []
            app.$message({ message: 'Bulk upload Successful!!!', type: 'success' })
            app.$emit('save')
          }
          app.loader = false
        })
        .catch(error => {
          app.$message({ message: error, type: 'danger' })
        })
    },

  },
}
</script>
<style scoped>
  .red {
    color: #c40505;
  }
</style>
