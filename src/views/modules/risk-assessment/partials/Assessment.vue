<template>
  <div
    v-loading="load"
  >
    <!-- <el-select
      v-model="selectedClient"
      value-key="id"
      placeholder="Select Client"
      style="width: 100%;"
      @input="fetchProjects()"
    >
      <el-option
        v-for="(client, index) in clients"
        :key="index"
        :value="client.id"
        :label="client.name"
      />
    </el-select> -->
    <table class="table table-bordered table-responsive">
      <thead>
        <tr>
          <th />
          <!-- <th>RA-ID</th> -->
          <th>Risk Owner</th>
          <th>Asset Types</th>
          <th>Assets</th>
          <th>Applicable Threat</th>
          <th>Applicable Vulnerability Desc</th>
          <th>Existing Control</th>
          <th>Likelihood Justification</th>
          <th>Likelihood Value</th>
          <th>Confidentiality</th>
          <th>Integrity</th>
          <th>Availability</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(entry, index) in entries"
          :key="index"
        >
          <td>
            <div>
              <el-tooltip
                effect="dark"
                content="Remove row"
                placement="top-start"
              >
                <el-button
                  v-if="entries.length > 1"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeEntry(index)"
                />
              </el-tooltip>
              <br>
              <el-tooltip
                effect="dark"
                content="Add another row"
                placement="top-start"
              >

                <el-button
                  v-if="index + 1 === entries.length"
                  type="success"
                  icon="el-icon-plus"
                  circle
                  @click="addEntry(index)"
                />
              </el-tooltip>
              <br>
              <el-tooltip
                effect="dark"
                content="Duplicate row"
                placement="top-start"
              >

                <el-button
                  v-if="index + 1 === entries.length"
                  type="primary"
                  icon="el-icon-document-copy"
                  circle
                  @click="copyEntry(entry)"
                />
              </el-tooltip>
            </div>
          </td>
          <!-- <td>
            <input
              v-model="entry.ra_id"
              placeholder="e.g 001"
              type="number"
            >
          </td> -->
          <td>
            <input
              v-model="entry.risk_owner"
              placeholder="e.g CEO"
              type="text"
            >
          </td>
          <td>
            <select
              v-model="entry.asset_type_id"
              placeholder="Select Asset Type"
            >
              <option
                v-for="(asset_type, _index) in asset_types"
                :key="_index"
                :label="asset_type.name"
                :value="asset_type.id"
              />
            </select>
          </td>
          <td>
            <input
              v-model="entry.asset"
              placeholder="e.g Head of Units"
              type="text"
            >
          </td>
          <td>
            <input
              v-model="entry.threat_impact_description"
              placeholder="Describe applicable threat sources"
              type="text"
            >
          </td>
          <td>
            <input
              v-model="entry.vulnerability_description"
              placeholder="Describe applicable vulnerabilities"
              type="text"
            >
          </td>
          <td>
            <input
              v-model="entry.existing_controls"
              placeholder="what controls do you have on ground?"
              type="text"
            >
          </td>
          <td>
            <input
              v-model="entry.likelihood_justification"
              placeholder="Give likelihood justification"
              type="textarea"
            >
          </td>
          <td>
            <select
              v-model="entry.risk_likelihood_id"
              filterable
              style="width: 100%"
              placeholder="Likelihood value"
            >
              <option
                v-for="(likelihood, likelihood_index) in likelihoods"
                :key="likelihood_index"
                :label="`${likelihood.value}-${likelihood.name}`"
                :value="likelihood.value"
              />
            </select>
          </td>
          <td>
            <select
              v-model="entry.confidentiality"
              filterable
              style="width: 100%"
              placeholder="Confidentiality"
            >
              <option
                v-for="(impact, impact_index) in impacts"
                :key="impact_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              />
            </select>
          </td>
          <td>
            <select
              v-model="entry.integrity"
              filterable
              style="width: 100%"
              placeholder="Integrity"
            >
              <option
                v-for="(impact, impact_index) in impacts"
                :key="impact_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              />
            </select>
          </td>
          <td>
            <select
              v-model="entry.availability"
              filterable
              style="width: 100%"
              placeholder="Availability"
            >
              <option
                v-for="(impact, impact_index) in impacts"
                :key="impact_index"
                :label="`${impact.value}-${impact.name}`"
                :value="impact.value"
              />
            </select>
          </td>
          <td>
            <div>
              <el-tooltip
                effect="dark"
                content="Remove row"
                placement="top-start"
              >
                <el-button
                  v-if="entries.length > 1"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeEntry(index)"
                />
              </el-tooltip>
              <br>
              <el-tooltip
                effect="dark"
                content="Add another row"
                placement="top-start"
              >

                <el-button
                  v-if="index + 1 === entries.length"
                  type="success"
                  icon="el-icon-plus"
                  circle
                  @click="addEntry(index)"
                />
              </el-tooltip>
              <br>
              <el-tooltip
                effect="dark"
                content="Duplicate row"
                placement="top-start"
              >

                <el-button
                  v-if="index + 1 === entries.length"
                  type="primary"
                  icon="el-icon-document-copy"
                  circle
                  @click="copyEntry(entry)"
                />
              </el-tooltip>
            </div>
          </td>
        </tr>
        <tr v-if="fill_fields_error">
          <td colspan="6">
            <el-alert
              type="error"
            >Please fill all empty fields before adding another row</el-alert>
          </td>
        </tr>
      </tbody>
    </table>
    <el-button
      v-if="!isRowEmpty()"
      round
      type="success"
      @click="submit()"
    >
      Submit
    </el-button>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  props: {
    standardId: {
      type: Number,
      required: true,
    },
    selectedClient: {
      type: Object,
      default: () => ({}),
    },
    likelihoods: {
      type: Array,
      default: () => ({}),
    },
    impacts: {
      type: Array,
      default: () => ({}),
    },
    matrix: {
      type: String,
      default: '3x3',
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(date) {
          const d = new Date() // today
          d.setDate(d.getDate())
          return date >= d
        },
      },
      entries: [],
      activeName: '1',
      invoice_items: [],
      customer_name: '',
      selected_index: '',
      total: 0,
      dialogVisible: false,
      fill_fields_error: false,
      showSaveButton: true,
      load: false,
      rowIndex: '',
      categories: [],
      asset_types: [],
      BlockRemoval: false,
    }
  },
  watch: {
    // selectedClient() {
    //   const app = this
    //   const customer = app.selectedCustomer
    //   const { rowIndex } = app
    //   this.setCustomerDetails(customer, rowIndex)
    // },
  },
  created() {
    this.addEntry()
    this.fetchAssetTypes()
  },
  methods: {
    fetchAssetTypes() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-asset-types')
      app.loading = true
      fetchEntryResource.list()
        .then(response => {
          app.asset_types = response.asset_types
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    isRowEmpty() {
      const checkEmptyLines = this.entries.filter(
        detail => detail.asset_type_id === ''
          // || detail.ra_id === ''
          || detail.asset === ''
          || detail.risk_owner === ''
          || detail.threat_impact_description === ''
          || detail.vulnerability_description === ''
          || detail.existing_controls === ''
          || detail.likelihood_justification === ''
          || detail.risk_likelihood_id === ''
          || detail.confidentiality === ''
          || detail.integrity === ''
          || detail.availability === '',
      )
      if (checkEmptyLines.length > 0) {
        return true
      }
      return false
    },
    addEntry() {
      this.fill_fields_error = false

      if (this.isRowEmpty()) {
        this.fill_fields_error = true
      } else {
        // if (this.invoice_items.length > 0)
        //     this.invoice_items[index].grade = '';
        this.entries.push({
          // ra_id: '',
          asset_type_id: '',
          asset: '',
          risk_owner: '',
          threat_impact_description: '',
          vulnerability_description: '',
          existing_controls: '',
          likelihood_justification: '',
          risk_likelihood_id: '',
          confidentiality: '',
          integrity: '',
          availability: '',
          // impact_value: '',
          // risk_value: '',
          // risk_category_id: '',
        })
      }
    },
    copyEntry(entry) {
      if (this.isRowEmpty()) {
        this.fill_fields_error = true
      } else {
        this.entries.push({
          asset_type_id: entry.asset_type_id,
          asset: entry.asset,
          risk_owner: entry.risk_owner,
          threat_impact_description: '',
          vulnerability_description: '',
          existing_controls: '',
        })
      }
    },
    removeEntry(detailId) {
      this.fill_fields_error = false
      if (!this.BlockRemoval) {
        this.entries.splice(detailId, 1)
      }
    },
    submit() {
      const app = this
      app.$confirm('Are you sure you want to submit these entries?', 'Warning', {
        confirmButtonText: 'Yes Submit',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Sending...',
        // });
        if (app.entries.length > 0) {
          app.load = true
          const submitSales = new Resource('risk-assessment/store-risk-assessment')
          submitSales.store({ standard_id: app.standardId, client_id: app.selectedClient.id, assessments: app.entries }).then(() => {
            this.$message({
              type: 'success',
              message: 'Submitted Successfully',
            })
            app.$emit('submit', true)
            // app.entries = []
            // app.addEntry()
            app.load = false
          }).catch(() => {
            this.$message({
              type: 'danger',
              message: 'An error Occured',
            })
            app.load = false
          })
        }
        // app.loadForm = false;
      }).catch(() => {
        app.load = false
      })
    },
  },
}
</script>
