<template>
  <div>
    <el-button
      type="primary"
      @click="exportToExcel('riskAssessmentTabularSummary')"
    >
      Export
    </el-button>
    <table
      id="riskAssessmentTabularSummary"
      class="table table-bordered"
    >
      <thead>
        <tr>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          >Risk Owner</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          >Asset</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          >Asset Type</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          >Number of Threats</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          >Low</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          >Medium</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"
            style="font-size: 16px;"
            data-f-sz="16"
          >High</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(report, index) in data"
          :key="index"
        >
          <td>{{ report.risk_owner }}</td>
          <td>{{ report.asset }}</td>
          <td>{{ report.asset_type }}</td>
          <td>{{ report.no_of_threats }}</td>
          <td
            style="background: #008000; color: #ffffff;"
            data-fill-color="008000"
            data-f-color="ffffff"
          >
            {{ report.lows }}
          </td>
          <td
            style="background: #ffff00; color: #000000;"
            data-fill-color="ffff00"
            data-f-color="000000"
          >
            {{ report.mediums }}
          </td>
          <td
            style="background: #ff0000; color: #000000;"
            data-fill-color="ff0000"
            data-f-color="000000"
          >
            {{ report.highs }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import TableToExcel from '@linways/table-to-excel'

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
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  methods: {
    exportToExcel(id) {
      const app = this
      app.downloading = true
      setTimeout(() => {
        TableToExcel.convert(document.getElementById(id), {
          name: `${app.selectedClient.name}-RiskAssessmentSummary.xlsx`,
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
