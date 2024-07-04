<template>
  <div>
    <b-row class="match-height">
      <b-col md="8">
        <app-collapse
          accordion
          type="margin"
        >
          <app-collapse-item
            title="DESCRIPTION"
            :is-visible="true"
          >

            <b-row>
              <b-col md="12">
                <b-form-group
                  label="Key Process"
                >
                  <textarea
                    v-model="form.key_process"
                    class="form-control"
                    @blur="updateField($event, 'key_process', form)"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Control Activities"
                >
                  <textarea
                    v-model="form.control_activities"
                    class="form-control"
                    @blur="updateField($event, 'control_activities', form)"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Control Owner"
                >
                  <input
                    id="control_owner"
                    v-model="form.control_owner"
                    class="form-control"
                    @blur="updateField($event, 'control_owner', form)"
                  >
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Source"
                >
                  <input
                    v-model="form.source"
                    type="text"
                    class="form-control"
                    @blur="updateField($event, 'source', form)"
                  >
                </b-form-group>
              </b-col>
              <b-col
                md="12"
              >
                <b-form-group
                  label="Control Type"
                >
                  <input
                    id="control_type"
                    v-model="form.control_type"
                    class="form-control"
                    disabled
                  >
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Risk Description"
                >
                  <b-tooltip
                    target="risk_description"
                  />
                  <ckeditor
                    id="risk_description"
                    v-model="form.risk_description"
                    :editor="editor"
                    :config="editorConfig"
                    @blur="updateField($event.target.value, 'risk_description', form)"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Risk Rating"
                >
                  <select
                    v-model="form.risk_rating"
                    class="form-control"
                    @change="updateField($event, 'risk_rating', form)"
                  >
                    <option
                      label="High"
                      value="High"
                    />
                    <option
                      label="Medium"
                      value="Medium"
                    />
                    <option
                      label="Low"
                      value="Low"
                    />
                  </select>
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
          <app-collapse-item
            title="SELF ASSESSMENT"
          >

            <b-row>
              <b-col md="12">

                <b-form-group
                  label="Self Assessment of Control"
                >
                  <div :style="`background-color: #${setControlBgColor(form.self_assessment_control)}; padding: 10px;`">
                    <select
                      v-model="form.self_assessment_control"
                      class="form-control"
                      @change="updateField($event, 'self_assessment_control', form)"
                    >
                      <option
                        v-for="(control, control_index) in control_assessments"
                        :key="control_index"
                        :label="control"
                        :value="control"
                      />
                    </select>

                  </div>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Self Assessment Score"
                >
                  <input
                    id="self_assessment_score"
                    v-model="form.self_assessment_score"
                    class="form-control"
                    disabled
                  >

                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Comment on current status or action plan"
                >
                  <ckeditor
                    id="comment_on_status"
                    v-model="form.comment_on_status"
                    :editor="editor"
                    :config="editorConfig"
                    @blur="updateField($event, 'comment_on_status', form)"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
          <app-collapse-item
            title="VALIDATION"
          >

            <b-row>
              <b-col md="12">
                <b-form-group
                  label="RM Rating of Control"
                >

                  <div :style="`background-color: #${setControlBgColor(form.rm_rating_of_control)}; padding: 10px;`">
                    <select
                      v-model="form.rm_rating_of_control"
                      class="form-control"
                      @change="updateField($event, 'rm_rating_of_control', form)"
                    >
                      <option
                        v-for="(control, control_index) in control_assessments"
                        :key="control_index"
                        :label="control"
                        :value="control"
                      />
                    </select>
                  </div>
                </b-form-group>
                <hr>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Validation"
                >

                  <input
                    id="validation"
                    v-model="form.validation"
                    class="form-control"
                    disabled
                  >
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Basis of RM Rating "
                >
                  <ckeditor
                    id="basis_of_rm_rating"
                    v-model="form.basis_of_rm_rating"
                    :editor="editor"
                    :config="editorConfig"
                    @blur="updateField($event, 'basis_of_rm_rating', form)"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
          <app-collapse-item
            title="PROCESS LEVEL RISK ASSESSMENT"
          >

            <b-row>
              <b-col md="12">

                <b-form-group
                  label="Self Assessment of Process Level Risk"
                >

                  <div :style="`background-color: #${setRiskBgColor(form.self_assessment_of_process_level_risk)}; padding: 10px;`">
                    <input
                      id="self_assessment_of_process_level_risk"
                      v-model="form.self_assessment_of_process_level_risk"
                      class="form-control"
                      disabled
                    >
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="RM Validated Process Level Risk"
                >

                  <div :style="`background-color: #${setRiskBgColor(form.rm_validated_process_level_risk)}; padding: 10px;`">
                    <input
                      id="rm_validated_process_level_risk"
                      v-model="form.rm_validated_process_level_risk"
                      class="form-control"
                      disabled
                    >
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
          </app-collapse-item>
        </app-collapse>
        <P />
        <el-button
          type="primary"
          @click="$emit('updated', form)"
        >
          Update
        </el-button>
      </b-col>
      <b-col
        md="4"
      >
        <h3>Summary</h3>
        <hr>
        <strong>Self Assessment of Control</strong>
        <div :style="`background-color: #${setControlBgColor(form.self_assessment_control)}; padding: 10px;`">
          {{ form.self_assessment_control }}
        </div>
        <hr>
        <strong>RM Rating of Control</strong>
        <div :style="`background-color: #${setControlBgColor(form.rm_rating_of_control)}; padding: 10px;`">
          {{ form.rm_rating_of_control }}
        </div>
        <hr>
        <strong>Self Assessment of Process Level Risk</strong>
        <div :style="`background-color: #${setRiskBgColor(form.self_assessment_of_process_level_risk)}; padding: 10px;`">
          {{ form.self_assessment_of_process_level_risk }}
        </div>
        <hr>
        <strong>RM Validated Process Level Risk</strong>
        <div :style="`background-color: #${setRiskBgColor(form.rm_validated_process_level_risk)}; padding: 10px;`">
          {{ form.rm_validated_process_level_risk }}
        </div>
        <hr>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import {
  BRow, BCol, BFormGroup, BTooltip,
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
    BTooltip,
    AppCollapse,
    AppCollapseItem,
    // BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      control_assessments: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'N/A'],
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
        rcm_id: '',
        category: '',
        key_process: '',
        control_activities: '',
        control_owner: '',
        source: '',
        control_type: '',
        risk_description: '',
        risk_rating: '',
        self_assessment_control: '',
        self_assessment_score: '',
        comment_on_status: '',
        rm_rating_of_control: '',
        validation: '',
        basis_of_rm_rating: '',
        self_assessment_of_process_level_risk: '',
        rm_validated_process_level_risk: '',
        overall_process_control_rating: '',
      },
      loading: false,
      selectedClient: {},
      uploadableFile: null,
      risk_registers: [],
      risk_scenerios: [],
      showRisksForm: false,
      treatment_comment: '',
      treatment_alert_type: 'error',
      showTreatmentModal: false,
      showTreatmentOption: false,
    }
  },
  created() {
    this.form = this.selectedData
  },
  methods: {

    updateField(event, field, assessment) {
      const app = this
      const params = {
        field, value: event.target.value, client_id: app.form.client_id, business_unit_id: app.form.business_unit_id,
      }
      const updateResource = new Resource('rcsa/update-fields')
      updateResource.update(assessment.id, params)
        .then(response => {
          app.form = response.rcsa
        })
    },
    setControlBgColor(value) {
      let color = 'ff0000'
      switch (value) {
        case 'Level 2':
          color = 'ffa500'
          break
        case 'Level 3':
          color = 'ffff00'
          break
        case 'Level 4':
          color = '008000'
          break
        default:
          break
      }
      return color
    },
    setRiskBgColor(value) {
      let color = 'ff0000'
      switch (value) {
        case 'Medium':
          color = 'ffa500'
          break
        case 'Low':
          color = '008000'
          break
        default:
          break
      }
      return color
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
