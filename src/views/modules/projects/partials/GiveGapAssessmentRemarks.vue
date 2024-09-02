<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateStandardSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-standard-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5
            v-if="isAdmin"
            class="mb-0"
          >
            Fill the fields as applicable
          </h5>
          <h5
            v-else
            class="mb-0"
          >
            Consultant's Remarks
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
        <div
          v-if="isAdmin"
          class="justify-content-between align-items-center px-2 py-1"
        >
          <b-row v-loading="loading">

            <b-col cols="12">
              <label>Assessment Grade</label>
              <b-form-group
                label-for="v-consultant_grade"
              >
                <el-select
                  v-model="form.consultant_grade"
                  placeholder="Select Grade"
                  style="width: 100%;"
                  @input="saveRemark('consultant_grade')"
                >
                  <el-option
                    v-for="(grade, index) in grades"
                    :key="index"
                    :value="grade"
                    :label="grade"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <label>Findings</label>
              <b-form-group
                label-for="v-findings"
              >
                <el-input
                  v-model="form.findings"
                  type="textarea"
                  placeholder="State your findings..."
                  style="width: 100%;"
                  @blur="saveRemark('findings')"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <label>Recommendations</label>
              <b-form-group
                label-for="v-recommendations"
              >
                <el-input
                  v-model="form.recommendations"
                  type="textarea"
                  placeholder="State your recommendations..."
                  style="width: 100%;"
                  @blur="saveRemark('recommendations')"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <label>Assessment Status</label>
              <b-form-group
                label-for="v-status"
              >
                <el-select
                  v-model="form.status"
                  placeholder="Select Status"
                  style="width: 100%;"
                  @input="saveRemark('status')"
                >
                  <el-option
                    v-for="(status, index) in statuses"
                    :key="index"
                    :value="status"
                    :label="status"
                  />
                </el-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <label>General Remark</label>
              <b-form-group
                label-for="v-remark"
              >
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  placeholder="Type your remark here..."
                  style="width: 100%;"
                  @blur="saveRemark('remark')"
                />
              </b-form-group>
            </b-col>
            <!-- submit and reset -->
            <b-col
              cols="12"
            >
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="$emit('reload')"
              >
                Submit
              </b-button>
            </b-col>
          </b-row>
        </div>
        <div
          v-else
          class="justify-content-between align-items-center px-2 py-1"
        >
          <b-row v-loading="loading">

            <b-col cols="12">
              <label>Assessment Grade</label>
              <p>{{ form.consultant_grade }}</p>
            </b-col>
            <b-col cols="12">
              <label>Findings</label>
              <p>{{ form.findings }}</p>
            </b-col>
            <b-col cols="12">
              <label>Recommendations</label>
              <p>{{ form.recommendations }}</p>
            </b-col>
            <b-col cols="12">
              <label>Assessment Status</label>
              <p>{{ form.status }}</p>
            </b-col>
            <b-col cols="12">
              <label>General Remark</label>
              <p>{{ form.remark }}</p>
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
    prop: 'isCreateStandardSidebarActive',
    event: 'update:is-create-standard-sidebar-active',
  },
  props: {
    isCreateStandardSidebarActive: {
      type: Boolean,
      required: true,
    },
    answer: {
      type: Object,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      form: {
        id: '',
        consultant_grade: '',
        findings: '',
        recommendations: '',
        status: '',
        remark: '',
      },
      loading: false,
      grades: ['Conformity', 'Non-Conformity', 'Opportunity For Improvement', 'Not Applicable'],
      statuses: ['Open', 'Work In Progress', 'Closed'],
      selectedConsulting: {},
    }
  },
  created() {
    this.form = this.answer
  },
  methods: {
    saveRemark(field) {
      const app = this
      const { form } = app
      // console.log(answer[field])
      const param = { answer: form[field], field }
      const fetchConsultingsResource = new Resource('answers/update')
      fetchConsultingsResource.update(form.id, param)
        .then(() => {})
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
