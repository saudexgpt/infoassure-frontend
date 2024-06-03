<template>
  <div>
    <div
      v-if="selectedClient !== null"
      v-loading="loading"
    >
      <el-row
        :gutter="20"
      >
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <aside>
            <p>Select the matrix your company uses</p>
            <table class="table table-bordered">
              <tr>
                <th>Matrix</th>
                <th />
              </tr>
              <tr
                v-for="(matrix_val, index) in matrices"
                :key="index"
              >
                <td>{{ matrix_val }}</td>
                <td><el-button
                  size="mini"
                  type="warning"
                  @click="sendProposedMatrix(matrix_val)"
                >
                  Select
                </el-button></td>
              </tr>
            </table>
          </aside>
        </el-col>
        <el-col
          :xs="24"
          :sm="16"
          :md="16"
        >
          <table
            v-if="risk_matrix !== null"
            class="table table-bordered"
          >
            <tr>
              <th v-if="risk_matrix.proposed_matrix !== null">
                Proposed Matrix
              </th>
              <th v-if="risk_matrix.proposed_matrix === null">
                Active Matrix
              </th>
              <th v-if="risk_matrix.proposed_matrix !== null">
                Proposed By
              </th>
              <th v-if="risk_matrix.proposed_matrix === null">
                Approved By
              </th>
              <th v-if="risk_matrix.proposed_matrix !== null" />
            </tr>
            <tr>
              <td v-if="risk_matrix.proposed_matrix !== null">
                {{ risk_matrix.proposed_matrix }}
              </td>
              <td v-if="risk_matrix.proposed_matrix === null">
                {{ risk_matrix.current_matrix }}
              </td>
              <td v-if="risk_matrix.proposed_matrix !== null">
                {{ risk_matrix.creator.name }}
              </td>
              <td v-if="risk_matrix.proposed_matrix === null">
                {{ risk_matrix.approver.name }}
              </td>
              <td v-if="risk_matrix.proposed_matrix !== null">
                <el-button
                  size="mini"
                  type="success"
                  @click="approvematrix(risk_matrix.id)"
                >
                  Click to approve
                </el-button>
              </td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <div v-if="matrix !== ''">
        <h3>Details of {{ matrix }} Matrix</h3>
        <p>You can modify the description to suite your company's need</p>
        <el-row :gutter="20">
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
          >
            <h3>Impact Ratings</h3>
            <aside>

              <table
                class="table table-bordered"
              >
                <tr>
                  <td>Rating</td>
                  <td>Description</td>
                </tr>
                <tr
                  v-for="(content, impact_matrix_index) in impact_matrices[matrix]"
                  :key="impact_matrix_index"
                >
                  <td>{{ content.value }}</td>
                  <td>
                    <input
                      v-model="content.name"
                      type="text"
                      class="form-control"
                      @blur="customizeRiskDescription(content.id, 'impact', $event)"
                    >
                  </td>
                </tr>
              </table>
            </aside>
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
          >
            <h3>Likelihood Ratings</h3>
            <aside>

              <table
                class="table table-bordered"
                nowrap
              >
                <tr>
                  <td>Rating</td>
                  <td>Description</td>
                </tr>
                <tr
                  v-for="(content, likelihood_matrix_index) in likelihood_matrices[matrix]"
                  :key="likelihood_matrix_index"
                >
                  <td>{{ content.value }}</td>
                  <td>
                    <input
                      v-model="content.name"
                      type="text"
                      class="form-control"
                      @blur="customizeRiskDescription(content.id, 'impact', $event)"
                    >
                  </td>
                </tr>
              </table>
            </aside>
          </el-col>
        </el-row>
        <el-row>
          <el-col :col="12">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Rating</th>
                    <th>Description</th>
                    <th
                      v-for="(impact_on_area, impact_area_index1) in impact_matrices[matrix][0].impact_on_areas"
                      :key="impact_area_index1"
                    >
                      {{ impact_on_area.impact_area.area }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(content, i_matrix_index) in impact_matrices[matrix]"
                    :key="i_matrix_index"
                  >
                    <td>{{ content.value }}</td>
                    <td>{{ content.name }}</td>
                    <td
                      v-for="(impact_on_area, impact_area_index2) in content.impact_on_areas"
                      :key="impact_area_index2"
                    >
                      <div>
                        <textarea
                          v-model="impact_on_area.impact_level"
                          type="text"
                          :placeholder="`Enter ${impact_on_area.impact_area.area}`"
                          @blur="saveImpactOnAreas(impact_on_area.id, $event)"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {
  },
  props: {
    selectedClient: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      clients: [],
      matrices: [],
      impact_matrices: [],
      likelihood_matrices: [],
      form: {
        proposed_matrix: '',
        client_id: '',
      },
      risk_matrix: null,
      matrix: '',
      risk_impact_areas: [],
      loader: false,
      loading: false,
    }
  },
  created() {
    this.loadFunctions()
  },
  methods: {
    loadFunctions() {
      this.fetchRiskMatricesSetup()
      this.fetchRiskImpactAreas()
    },
    fetchRiskImpactAreas() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('fetch-risk-impact-area')
      fetchRisksResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.risk_impact_areas = response.risk_impact_areas
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchRiskMatricesSetup() {
      const app = this
      const fetchMatriceResource = new Resource('setup-risk-matrices')
      fetchMatriceResource.list({ client_id: app.selectedClient.id }).then(response => {
        app.impact_matrices = response.impact_matrices
        app.likelihood_matrices = response.likelihood_matrices
        app.risk_matrix = response.risk_matrix
        app.matrix = response.risk_matrix.current_matrix
        app.matrices = response.matrices
      }).catch()
    },
    customizeRiskDescription(id, table, event) {
      const name = event.target.value
      const fetchMatriceResource = new Resource('customize-risk-matrix-description')
      fetchMatriceResource.store({ id, table, name }).then().catch()
    },
    saveImpactOnAreas(id, event) {
      const { value } = event.target
      const approveMatrixResource = new Resource('update-risk-impact-on-area')
      approveMatrixResource.update(id, { impact_level: value }).then(() => {
      }).catch()
    },
    sendProposedMatrix(matrix) {
      const app = this
      app.loader = true
      app.form.client_id = app.selectedClient.id
      app.form.proposed_matrix = matrix
      const proposedMatrixResource = new Resource('propose-matrix')
      proposedMatrixResource.store(app.form).then(response => {
        app.$notify({ message: `${matrix} Matrix activation request sent and awaiting approval`, type: 'success' })
        app.risk_matrix = response.risk_matrix
        app.loader = false
      }).catch(app.loader = false)
    },
    approvematrix(id) {
      const app = this
      app.loader = true
      const approveMatrixResource = new Resource('approve-matrix')
      approveMatrixResource.update(id).then(() => {
        app.loadFunctions()
        app.loader = false
      }).catch(app.loader = false)
    },

  },
}
</script>
