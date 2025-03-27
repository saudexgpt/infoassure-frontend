<template>
  <div>
    <b-button
      variant="outline-secondary"
      @click="exportToExcel('soaTabularSummary')"
    >
      Export
    </b-button>
    <table
      id="soaTabularSummary"
      class="table table-bordered"
    >
      <thead>
        <tr>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"

            data-f-sz="16"
          >Area</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"

            data-f-sz="16"
          >Number of ISO/IEC 27001 Controls</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"

            data-f-sz="16"
          >Number of Applicable Controls</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"

            data-f-sz="16"
          >% Controls applicable</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"

            data-f-sz="16"
          >Number of  Applicable Controls Implemented</th>
          <th
            data-fill-color="333333"
            data-f-color="ffffff"

            data-f-sz="16"
          >%  Applicable Controls Implemented</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(report, index) in data"
          :key="index"
        >
          <td>{{ report.name }}</td>
          <td>{{ report.no_of_controls }}</td>
          <td>{{ report.applicable_controls }}</td>
          <td>{{ report.percent_control_applicable }}%</td>
          <td>{{ report.implemented_controls }}</td>
          <td>{{ report.percent_control_implemented }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import {
  BButton,
} from 'bootstrap-vue'
import TableToExcel from '@linways/table-to-excel'

export default {
  components: {
    BButton,
  },
  props: {
    data: {
      type: Array,
      default: () => ([]),
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
          name: `${app.selectedClient.name}-SOA-TabularSummary.xlsx`,
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
