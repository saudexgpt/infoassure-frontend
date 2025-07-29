<!-- eslint-disable vue/html-indent -->
<template>
  <el-card>
    <template v-slot:header>
      <div>
        <span v-if="isEdit" class="pull-right">
          <el-button type="primary" size="mini" @click="isEdit = false">
            View Summary Sheet
          </el-button>
        </span>
        <h4>Risk Assessment</h4>
      </div>
    </template>

    <el-container style="height: 100%; border: 1px solid #eee; background: #fff">
      <el-aside v-loading="loading" width="300px" style="background-color: #f0f0f0; overflow: auto">
        <aside>
          <el-input v-model="filterText" placeholder="Filter keyword" />
        </aside>
        <el-menu background-color="#fcfcfc" text-color="#00000">
          <el-submenu
            v-for="(assessments, index) in grouped_risk_assessments"
            :key="index"
            :index="index"
          >
            <template v-slot:title>
              {{ index.substring(0, 20) }}
            </template>
            <el-menu-item
              v-for="(detail, detail_index) in assessments"
              :key="detail_index"
              :index="`${index}-${detail_index}`"
              @click="viewDetails(detail)"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="detail.vulnerability_description"
                placement="top-start"
              >
                <template v-slot:content>
                  <!-- eslint-disable-next-line vue/no-v-html-->
                  <span v-html="detail.vulnerability_description"></span>
                </template>
                <span v-if="detail.vulnerability_description.length > 30">
                  {{ detail.risk_id }} - {{ detail.vulnerability_description.substring(0, 30) }}...
                </span>
                <span v-else> {{ detail.risk_id }} - {{ detail.vulnerability_description }} </span>
              </el-tooltip>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- <el-tree
            ref="tree"
            v-loading="loading"
            class="filter-tree"
            :highlight-current="true"
            :accordion="true"
            :indent="1"
            :data="grouped_risk_assessments"
            :filter-node-method="filterNode"
            @node-click="viewDetails"
        /> -->
      </el-aside>

      <el-container>
        <el-main v-loading="loadView">
          <div v-if="isEdit">
            <edit-risk-assessment
              :impacts="impacts"
              :likelihoods="likelihoods"
              :selected-data="selectedData"
              :risk-appetite="risk_appetite"
              @updated="renderViewAgain"
            />
          </div>
          <div v-else>
            <risk-assessment-table
              :selected-client="selectedClient"
              :impacts="impacts"
              :likelihoods="likelihoods"
              :assessment-module="assessmentModule"
            />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>
<script>
import Resource from '@/api/resource'
import EditRiskAssessment from './partials/EditRiskAssessment.vue'
import RiskAssessmentTable from './partials/RiskAssessmentTable.vue'

export default {
  components: {
    EditRiskAssessment,
    RiskAssessmentTable
  },
  props: {
    assessmentModule: {
      type: String,
      default: () => 'isms' // this is the general risk assessment
    }
  },
  data() {
    return {
      selectedData: null,
      grouped_risk_assessments: {},
      loading: false,
      inputVisible: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
      loadView: false,
      impacts: [],
      likelihoods: [],
      risk_appetite: null,
      response: {}
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    selectedClient() {
      this.fetchRiskAssessments(true)
      this.setMatrix()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.fetchRiskAssessments(true)
    this.setMatrix()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.label.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    handleClose(tag) {
      this.sub_dpias.splice(this.sub_dpias.indexOf(tag), 1)
    },
    createNew() {
      this.isEdit = false
      this.form = { name: '', sub_dpias: [] }
      this.sub_dpias = []
    },
    viewDetails(data) {
      if (data.id) {
        this.loadView = true
        this.isEdit = false
        setTimeout(() => {
          this.selectedData = data
          this.isEdit = true
          this.loadView = false
        }, 10)
      }
    },
    fetchRiskAssessments(load = true) {
      this.loading = load
      const fetchRiskAssessmentsResource = new Resource('risk-assessment/fetch-risk-assessments')
      fetchRiskAssessmentsResource
        .list({
          client_id: this.selectedClient.id,
          standard_id: this.standardId,
          module: this.assessmentModule
        })
        .then((response) => {
          this.grouped_risk_assessments = response.grouped_risk_assessments
          this.risk_appetite = response.risk_appetite
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    setMatrix() {
      this.fetchImpacts()
      this.fetchLikelihoods()
    },
    fetchImpacts() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.impacts = response.impacts
        })
        .catch((error) => {
          this.loading = false
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const param = { client_id: this.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource
        .list(param)
        .then((response) => {
          this.likelihoods = response.likelihoods
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
        })
    },
    renderViewAgain() {
      this.fetchDPIA()
      this.$notify({ title: 'Entry Updated', type: 'success' })
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
