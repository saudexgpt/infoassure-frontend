<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create New Entry
          </h5>
          <div>
            <b-button
              variant="gradient-danger"
              class="btn-icon"
              @click="hide"
            >
              <feather-icon
                icon="XIcon"
              />
            </b-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <b-row v-loading="loading">

            <b-col cols="12">
              <b-form-group
                label="Select Business Unit"
                label-for="v-standard"
              >
                <el-select
                  v-model="business_unit_id"
                  placeholder="Select Business Unit"
                  style="width: 100%;"
                  filterable
                  @input="fetchBusinessProcesses(); fetchRiskRegister()"
                >
                  <el-option
                    v-for="(business_unit, index) in business_units"
                    :key="index"
                    :value="business_unit.id"
                    :label="business_unit.unit_name"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col
              v-if="business_unit_id !== ''"
              cols="12"
            >
              <b-form-group
                label="Select Risk"
                label-for="v-level_group"
              >
                <el-select
                  v-model="selected_risk_register"
                  placeholder="Select Risk"
                  value-key="id"
                  style="width: 100%;"
                  filterable
                >
                  <el-option
                    v-for="(risk_register, index) in risk_registers"
                    :key="index"
                    :value="risk_register"
                    :label="`(${risk_register.risk_id}) - ${risk_register.vulnerability_description}`"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col
              v-if="business_unit_id !== ''"
              cols="12"
            >
              <b-form-group
                label="Select Business Process(es)"
              >
                <el-select
                  v-model="selected_business_processes"
                  placeholder="Select Business process"
                  value-key="id"
                  style="width: 100%;"
                  multiple
                  collapse-tags
                  filterable
                >
                  <el-option
                    v-for="(business_process, index) in business_processes"
                    :key="index"
                    :value="business_process"
                    :label="business_process.name"
                  />
                </el-select>
                <small>Multiple selection enabled</small>
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                :disabled="business_unit_id === '' || selected_risk_register === '' || selected_business_processes.length < 1"
                @click="addEntry()"
              >
                Continue
              </b-button>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar, BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isCreateSidebarActive',
    event: 'update:is-create-sidebar-active',
  },
  props: {
    isCreateSidebarActive: {
      type: Boolean,
      required: true,
    },
    standardId: {
      type: Number,
      required: true,
    },
    selectedClient: {
      type: Object,
      default: () => ({}),
    },
    assessmentModule: {
      type: String,
      default: () => ('ra'), // this is the general risk assessment
    },
  },
  data() {
    return {
      business_units: [],
      business_unit_id: '',
      business_processes: [],
      risk_registers: [],
      selected_business_processes: [],
      selected_risk_register: '',
      entries: [],
      loading: false,
    }
  },
  created() {
    this.fetchBusinessUnits()
  },
  methods: {
    fetchBusinessUnits() {
      const app = this
      app.loading = true
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.business_units = response.business_units
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchRiskRegister() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('fetch-risk-registers')
      fetchRisksResource.list({ client_id: app.selectedClient.id, business_unit_id: app.business_unit_id })
        .then(response => {
          app.risk_registers = response.risk_registers
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchBusinessProcesses() {
      const app = this
      app.business_processes = []
      const fetchBusinessProcesssResource = new Resource('business-units/fetch-business-processes')
      fetchBusinessProcesssResource.list({ business_unit_id: app.business_unit_id })
        .then(response => {
          app.business_processes = response.business_processes
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    addEntry() {
      const selectedRiskRegister = this.selected_risk_register
      this.selected_business_processes.forEach(businessProcess => {
        this.entries.push({
          risk_id: selectedRiskRegister.risk_id,
          risk_register_id: selectedRiskRegister.id,
          business_process_id: businessProcess.id,
        })
      })
      this.submit()
    },
    submit() {
      const app = this
      if (app.entries.length > 0) {
        app.loading = true
        const submitResource = new Resource('risk-assessment/store-risk-assessment')
        submitResource.store({
          module: app.assessmentModule,
          standard_id: app.standardId,
          client_id: app.selectedClient.id,
          business_unit_id: app.business_unit_id,
          assessments: app.entries,
        }).then(() => {
          this.$message({
            type: 'success',
            message: 'Submitted Successfully',
          })
          app.$emit('submit')
          app.$emit('update:is-create-sidebar-active', false)
          // app.entries = []
          // app.addEntry()
          app.loading = false
        }).catch(() => {
          this.$message({
            type: 'danger',
            message: 'An error Occured',
          })
          app.loading = false
        })
      }
    },
  },
}
</script>
  <style lang="scss" scoped>
  @import '~@core/scss/base/bootstrap-extended/include';
  </style>
