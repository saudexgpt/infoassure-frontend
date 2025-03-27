<template>
  <div v-loading="loading">
    <b-row class="match-height">
      <b-col md="8">
        <app-collapse
          accordion
          type="margin"
        >
          <app-collapse-item
            v-for="(distruption_impact, index) in selectedData.impacts"
            :key="index"
            :title="distruption_impact.criteria"
            :is-visible="true"
          >

            <b-row>
              <b-col
                v-for="(impact_data, impact_index) in distruption_impact.process_disruption_impact"
                :key="impact_index"
                md="6"
              >
                <b-form-group
                  :label="`${impact_data.name} (${impact_data.time_in_minutes} mins)`"
                >
                  <!-- <b-tooltip
                      target="likelihood"
                      title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                    /> -->
                  <select
                    v-model="impact_data.value"
                    placeholder="Select Impact Value"
                    class="form-control"
                    @change="updateImpact(distruption_impact.id, impact_data.id, $event.target.value)"
                  >
                    <option
                      v-for="(impact, c_index) in impacts"
                      :key="c_index + impact_index"
                      :label="`${impact.value}-${impact.name}`"
                      :value="impact.value"
                    />
                  </select>
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
        </app-collapse>
        <hr>
        <b-row>
          <b-col
            md="12"
          >
            <b-form-group
              label="MAO (Maximum Allowable Outage)"
            >
              <!-- <b-tooltip
                      target="likelihood"
                      title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                    /> -->
              <input
                v-model="selectedData.maximum_allowable_outage"
                placeholder="ENTER Maximum Allowable Outage"
                class="form-control"
                @change="updateBIA(selectedData.id, 'maximum_allowable_outage', $event.target.value)"
              >
            </b-form-group>
          </b-col>
          <b-col
            md="6"
          >
            <b-form-group
              label="RTO (Recovery Time Objective)"
            >
              <!-- <b-tooltip
                      target="likelihood"
                      title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                    /> -->
              <el-input
                v-model="selectedData.recovery_time_objective"
                placeholder="ENTER Recovery Time Objective"
                @change="updateBIA(selectedData.id, 'recovery_time_objective', $event)"
              >
                <template #append>
                  Hour(s)
                </template>
              </el-input>
            </b-form-group>
          </b-col>
          <b-col
            md="6"
          >
            <b-form-group
              label="RPO (Recovery Point Objective)"
            >
              <!-- <b-tooltip
                      target="likelihood"
                      title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
                    /> -->
              <input
                v-model="selectedData.recovery_point_objective"
                placeholder="ENTER Recovery Point Objective"
                class="form-control"
                @change="updateBIA(selectedData.id, 'recovery_point_objective', $event.target.value)"
              >
            </b-form-group>
          </b-col>
        </b-row>
        <P />
        <b-button
          gradient="primary"
          @click="formSubmitted()"
        >
          Done
        </b-button>
      </b-col>
      <b-col
        md="4"
      >
        <div
          v-if="selectedData !== null"
        >
          <div
            style="background: #f7f0da; padding: 10px; border: 2px solid #d2a204; border-radius: 5px;"
          >
            <p>
              <strong>Business Unit:</strong><br>
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.business_unit" />
            </p>
            <p>
              <strong>Business Process:</strong><br>
              <!-- eslint-disable-next-line vue/no-v-html-->
              <span v-html="selectedData.business_process" />
            </p>
          </div>
          <hr>
          <h3>PRIORITY</h3>
          <div
            :style="`background: #${form.priority_color}; color: #000000; text-align: center; padding: 20px; border: 2px solid #000000; border-radius: 5px;`"
          >
            <h1>{{ form.priority }}</h1>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import {
  BRow, BCol, BFormGroup, BButton,
} from 'bootstrap-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    AppCollapse,
    AppCollapseItem,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedData: {
      type: Object,
      required: true,
    },
    impacts: {
      type: Array,
      default: () => ({}),
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
        impacts: [],
      },
      loading: false,
      selectedClient: {},
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false,
    }
  },
  watch: {
    selectedData() {
      this.form = this.selectedData
    },
  },
  created() {
    this.form = this.selectedData
  },
  methods: {
    updateField(value, field, id) {
      const app = this
      const params = {
        field, value,
      }
      // eslint-disable-next-line no-param-reassign
      // assessment.loader = true
      const updateResources = new Resource('bia/update-fields')
      updateResources.update(id, params)
        .then(response => {
          app.form = response
        }).catch(() => {
          // eslint-disable-next-line no-param-reassign
          app.selectedData.loader = false
        })
    },
    formSubmitted() {
      const app = this
      app.$emit('updated')
    },
    async updateImpact(parentId, id, value) {
      const updateImpactResource = new Resource('bia/update-disruption-impact')
      const response = await updateImpactResource.update(parentId, { id, value })
      this.form = response.business_impact_analysis
    },
    async updateBIA(id, field, value) {
      const updateBIAResource = new Resource('bia/update-bia')
      await updateBIAResource.update(id, { value, field })
    },
  },
}
</script>
