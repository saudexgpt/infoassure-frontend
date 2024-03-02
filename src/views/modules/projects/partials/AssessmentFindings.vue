<template>
  <el-card>
    <el-button
      :loading="downloading"
      type="primary"
      @click="exportTableToExcel('assessmentFindingsTable')"
    >
      Export
    </el-button>
    <table
      id="assessmentFindingsTable"
      v-loading="load"
      class="table table-bordered table-striped table-responsive"
    >
      <thead>
        <tr>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Standard</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Clause/Requirement</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          ><div
            style="width: 350px;"
          >Question</div></th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Response</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Assessment Grade</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Findings</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Recommendations</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >Assessment Status</th>
          <th
            rowspan="2"
            style="font-size: 14px;"
            data-f-sz="14"
            data-fill-color="333333"
            data-f-color="ffffff"
          >General Remark</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(assessment, index) in assessment_answers"
          :key="index"
        >
          <td>{{ assessment.standard.name }}</td>
          <td>{{ assessment.clause.name }}</td>
          <!--eslint-disable-next-line vue/no-v-html-->
          <td><span v-html="assessment.question.question" /></td>
          <td>{{ assessment.yes_or_no }}<br><br>
            {{ assessment.open_ended_answer }}</td>
          <td>{{ assessment.consultant_grade }}</td>
          <td>{{ assessment.findings }}</td>
          <td>{{ assessment.recommendations }}</td>
          <td>{{ assessment.status }}</td>
          <td>{{ assessment.remark }}</td>
        </tr>
      </tbody>
    </table>
  </el-card>
</template>

<script>
import {
} from 'bootstrap-vue'
import TableToExcel from '@linways/table-to-excel'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'

export default {
  components: {
  },
  directives: {
    Ripple,
  },
  props: {
    selectedProject: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      load: false,
      isCreaterisk_assessmentsidebarActive: false,
      pageLength: 10,
      dir: false,
      assessment_answers: [],
      downloading: false,
    }
  },
  created() {
    this.fetchAssessmentAnswers()
  },
  methods: {
    checkPermission,
    fetchAssessmentAnswers() {
      const app = this
      app.load = true
      const fetchEntryResource = new Resource('reports/fetch-project-answers')
      fetchEntryResource.list({ project_id: app.selectedProject.id })
        .then(response => {
          app.load = false
          app.assessment_answers = response.assessment_answers
        })
        .catch(error => {
          app.load = false
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    exportTableToExcel(id) {
      const app = this
      app.downloading = true
      // const rawData = app.riskAssessments
      // import('@/vendor/Export2Excel').then(excel => {
      //   excel.export_table_to_excel(id)
      //   setTimeout(() => {
      //     app.downloading = false
      //   }, 2000)
      // })
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: 'AssessmentFindingsTable.xlsx',
          sheet: {
            name: 'Sheet 1',
          },
        })
      }, 1000)

      setTimeout(() => {
        app.downloading = false
      }, 30000)
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
