<!-- eslint-disable vue/html-indent -->
<template>
    <el-container style="height: 100%; border: 1px solid #eee; background: #fff;">
      <el-aside
        width="300px"
        style="background-color: #F0F0F0; overflow: auto;"
      >
        <div style="text-align: center; background-color: #333333; color: #ffffff; border-top-left-radius: 5px; border-top-right-radius: 5px;">
          <span>DPIA by Business Units</span>
        </div>
        <aside>
          <el-input
            v-model="filterText"
            placeholder="Filter keyword"
          />
        </aside>
        <el-tree
            ref="tree"
            class="filter-tree"
            :highlight-current="true"
            :accordion="true"
            :indent="1"
            :data="dpia_data"
            :filter-node-method="filterNode"
            @node-click="viewDetails"
        />
      </el-aside>

      <el-container
        v-loading="loading"
      >
        <el-header
          style="font-size: 12px; padding: 10px;"
        >
        <h4>
          Data Privacy Impact Assessment
        </h4>
        </el-header>

        <el-main>
          <div v-if="isEdit">
            <edit-d-p-i-a
            :impacts="impacts"
            :likelihoods="likelihoods"
            :selected-data="selectedData"
            :risk-appetite="risk_appetite"
            @updated="fetchDPIA(false); $notify({title: 'Entry Updated', type: 'success'})"
            />
          </div>
          <div v-else>
            <h4>Click on the menu for an assessment</h4>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </template>
<script>
import Resource from '@/api/resource'
import EditDPIA from './partials/EditDPIA.vue'

export default {
  components: {
    EditDPIA,
  },
  props: {
    selectedClient: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selectedData: null,
      dpia_data: [],
      loading: false,
      treeProps: {
        children: 'details',
        label: 'label',
      },
      inputVisible: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
      impacts: [],
      likelihoods: [],
      risk_appetite: null,
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    this.fetchDPIA(true)
    this.setMatrix()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.name.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    handleClose(tag) {
      this.sub_dpias.splice(this.sub_dpias.indexOf(tag), 1)
    },
    createNew() {
      const app = this
      app.isEdit = false
      app.form = { name: '', sub_dpias: [] }
      app.sub_dpias = []
    },
    viewDetails(data) {
      if (data.id) {
        const app = this
        app.selectedData = data
        app.isEdit = true
      }
    },
    fetchDPIA(load) {
      const app = this
      const fetchEntryResource = new Resource('dpia')
      app.loading = load
      fetchEntryResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.dpia_data = response.dpia_data
          app.risk_appetite = response.risk_appetite
          // eslint-disable-next-line prefer-destructuring
          app.loading = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    setMatrix() {
      this.fetchImpacts()
      this.fetchLikelihoods()
    },
    fetchImpacts() {
      const app = this
      const param = { client_id: app.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-impacts')
      fetchEntryResource.list(param)
        .then(response => {
          app.impacts = response.impacts
        })
        .catch(error => {
          app.loading = false
          // console.log(error.response)
          app.$message.error(error.response.data.error)
        })
    },
    fetchLikelihoods() {
      const app = this
      const param = { client_id: app.selectedClient.id }
      const fetchEntryResource = new Resource('risk-assessment/fetch-likelihoods')
      fetchEntryResource.list(param)
        .then(response => {
          app.likelihoods = response.likelihoods
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
        })
    },
  },
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
