<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateConsultingSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-consulting-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Consultings
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

            <!-- first name -->
            <b-col cols="12">
              <b-form-group
                label="Enter Name(s) of Consulting"
                label-for="v-level_group"
              >
                <b-form-input
                  v-model="form.names"
                  placeholder="example: Process Consulting"
                />
              </b-form-group><br>
              <small>You can enter multiple consultings, just separate them with a vertical bar <code>|</code></small>
            </b-col>
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
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
  BSidebar, BRow, BCol, BFormGroup, BFormInput, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isCreateConsultingSidebarActive',
    event: 'update:is-create-consulting-sidebar-active',
  },
  props: {
    isCreateConsultingSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        names: '',
      },
      selected_curriculum: '',
      curricula: [],
      loading: false,
    }
  },
  methods: {
    submit() {
      const app = this
      app.loading = true
      const saveCurriculumSetupResource = new Resource('consultings/save')
      const param = app.form
      saveCurriculumSetupResource.store(param)
        .then(response => {
          app.loading = false
          app.$emit('save', response)
          app.$emit('update:is-create-consulting-sidebar-active', false)
        }).catch(error => {
          app.loading = false
          app.$message(error.response.data.error)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
