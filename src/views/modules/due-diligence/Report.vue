<template>
  <div>
    <el-button
      :loading="downloading"
      type="primary"
      @click="exportToExcel('dueDiligenceReport')"
    >
      Export
    </el-button>
    <table
      id="dueDiligenceReport"
      class="table table-bordered table-responsive"
    >
      <thead>
        <tr>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          ><div style="width: 250px">
            Requirements
          </div></th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          ><div style="width: 250px">
            Key
          </div></th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          >Answer</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          ><div style="width: 250px">
            Detailed Explanation
          </div></th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          ><div style="width: 250px">
            Observation
          </div></th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          ><div style="width: 150px">
            Risk Score
          </div></th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          ><div style="width: 250px">
            Impact
          </div></th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          ><div style="width: 250px">
            Recommendation
          </div></th>
        </tr>
      </thead>
      <tbody v-if="!downloading">
        <tr
          v-for="(report, index) in data"
          :key="index"
        >
          <td>{{ report.question.question }}</td>
          <td>{{ report.question.key }}</td>
          <td>{{ report.answer }}</td>
          <td>{{ report.detailed_explanation }}</td>
          <td>
            <el-input
              v-model="report.observation"
              type="textarea"
              placeholder="State your observations..."
              style="width: 100%;"
              @blur="saveRemark('observation')"
            />

          </td>
          <td>
            <select
              v-model="report.risk_score"
              placeholder="Select Risk Score"
              style="width: 100%;"
              @input="saveRemark('risk_score')"
            >
              <option
                v-for="(score, score_index) in risk_scores"
                :key="score_index"
                :value="score.value"
                :label="score.label"
              />
            </select>
          </td>
          <td>
            <textarea
              v-model="report.impact"
              placeholder="State Impact..."
              style="width: 100%;"
              @blur="saveRemark('impact')"
            />

          </td>
          <td>

            <textarea
              v-model="report.recommendations"
              placeholder="Give Recommendations..."
              style="width: 100%;"
              @blur="saveRemark('recommendations')"
            />

          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr
          v-for="(report, index) in data"
          :key="index"
        >
          <td>{{ report.question.question }}</td>
          <td>{{ report.question.key }}</td>
          <td>{{ report.answer }}</td>
          <td>{{ report.detailed_explanation }}</td>
          <td>{{ report.observation }}</td>
          <td>{{ formatRiskScore(report.risk_score) }}</td>
          <td>{{ report.impact }}</td>
          <td>{{ report.recommendations }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import TableToExcel from '@linways/table-to-excel'
import Resource from '@/api/resource'

export default {
  components: {
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    selectedClient: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      risk_scores: [
        { value: 1, label: '1-Low' },
        { value: 2, label: '2-Medium' },
        { value: 3, label: '3-High' },
      ],
      downloading: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  methods: {
    saveRemark(field) {
      const app = this
      const { form } = app
      // console.log(answer[field])
      const param = { answer: form[field], field }
      const fetchConsultingsResource = new Resource('due-diligence/answers/update')
      fetchConsultingsResource.update(form.id, param)
        .then(() => {})
    },
    formatRiskScore(value) {
      const app = this
      const { risk_scores } = app
      let label = ''
      risk_scores.forEach(impact => {
        if (value === impact.value) {
          label = impact.label
        }
      })
      return label
    },
    exportToExcel(id) {
      const app = this
      app.downloading = true
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: `${app.selectedClient.name}-3rd-Party-Vendor-Due-Diligence-Assessment.xlsx`,
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
