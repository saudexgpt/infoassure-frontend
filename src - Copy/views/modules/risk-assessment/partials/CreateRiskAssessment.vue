<template>
  <div>

    <b-row>
      <b-col
        v-if="form.business_unit"
        md="6"
      >
        <b-form-group
          label="Business Unit"
        >
          <input
            v-model="form.business_unit"
            disabled
            class="form-control"
          >
        </b-form-group>
      </b-col>
      <b-col
        v-if="form.business_process"
        md="6"
      >
        <b-form-group
          label="Business Process"
        >
          <textarea
            v-model="form.business_process"
            disabled
            class="form-control"
          />
        </b-form-group>
      </b-col>
      <b-col
        v-if="form.asset_type"
        md="6"
      >
        <b-form-group
          label="Asset Type"
        >
          <input
            v-model="form.asset_type"
            disabled
            class="form-control"
          >
        </b-form-group>
      </b-col>
      <b-col
        v-if="form.asset"
        md="6"
      >
        <b-form-group
          label="Asset"
        >
          <input
            v-model="form.asset"
            disabled
            class="form-control"
          >
        </b-form-group>
      </b-col>
      <b-col md="12">
        <!-- <b-form-group
          label="Select Threats & Vulnerabilities"
        >
          <a
            style="color: #409EFF"
            @click="showRisksForm = true"
          > <i class="el-icon-plus" /> Click to pick from Risk Register</a>
          />
        </b-form-group> -->
        <v-client-table
          v-model="risk_registers"
          :columns="columns"
          :options="options"
        >
          <div
            slot="select"
            slot-scope="{row}"
          >
            <el-checkbox
              v-model="form.risk_register_ids"
              :label="row.risk_id"
              border
            />
          </div>
        </v-client-table>
      </b-col>
    </b-row>
    <P />
    <el-button
      :loading="loading"
      type="primary"
      @click="saveRiskAssessment()"
    >
      Save
    </el-button>
  </div>
</template>
<script>
import {
  BRow, BCol, BFormGroup,
} from 'bootstrap-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    // BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedData: {
      type: Object,
      default: () => (null),
    },
    riskAppetite: {
      type: Number,
      required: true,
    },
    likelihoods: {
      type: Array,
      default: () => ({}),
    },
    impacts: {
      type: Array,
      default: () => ({}),
    },
  },
  data() {
    return {
      createAssetTypeModal: false,
      createAssetModal: false,
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      form: {
        module: '',
        risk_register_ids: [],
        client_id: '',
        business_unit_id: null,
        business_process_id: null,
        asset_type_id: null,
        asset_id: null,
      },
      treatment_options: ['Avoid', 'Mitigate', 'Transfer', 'Accept'],
      columns: [
        'select',
        'risk_id',
        'threat',
        'vulnerability_description',
        'control_description',
      ],
      options: {
        headings: {
          risk_id: 'REF',
          vulnerability_description: 'Risk Desc',
          control_description: 'Control',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        sortable: ['risk_id', 'threat', 'vulnerability_description', 'control_description'],
        // filterable: false,
        filterable: ['risk_id', 'threat', 'vulnerability_description', 'control_description'],
      },
      loading: false,
      uploadableFile: null,
      risk_registers: [],
      risk_scenerios: [],
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false,
      asset_types: [],
      assets: [],
      selectedAssetTypeId: '',
      risk_appetite: null,
      performAssessment: false,
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  created() {
    this.form = this.selectedData
    this.fetchRiskRegister()
  },
  methods: {
    fetchRiskRegister() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('fetch-module-risk-registers')
      fetchRisksResource.list({ client_id: app.selectedClient.id, module: app.selectedData.module })
        .then(response => {
          app.risk_registers = response.risk_registers
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    saveRiskAssessment() {
      const app = this
      app.loading = true
      const fetchRisksResource = new Resource('risk-assessment/store-risk-assessment')
      fetchRisksResource.store(app.form)
        .then(() => {
          app.$emit('save')
          app.loading = false
        }).catch(() => { app.loading = false })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
