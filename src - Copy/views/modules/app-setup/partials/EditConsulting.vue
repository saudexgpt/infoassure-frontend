<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditConsultingSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-consulting-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Unit
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
                label="Update Unit"
                label-for="v-level_group"
              >
                <b-form-input
                  v-model="form.name"
                  placeholder="example: Process Consulting"
                />
              </b-form-group>
            </b-col>
            <!-- Level Name -->
            <!-- <b-col cols="12">
              <b-form-group
                label="Consulting Description"
                label-for="v-level_group"
              >
                <b-form-textarea
                  v-model="form.description"
                  placeholder="Briefly describe this consulting"
                />
              </b-form-group>
            </b-col> -->
            <!-- submit and reset -->
            <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="warning"
                class="mr-1"
                @click="update()"
              >
                Update
              </b-button>
            </b-col>
            <b-col
              v-if="error"
              cols="12"
            >
              <b-alert
                variant="danger"
                show
              >
                <div class="alert-body">
                  <span><strong>{{ error_message }}</strong></span>
                </div>
              </b-alert>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar, BRow, BCol, BFormGroup, BFormInput, BButton, BAlert,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    // BFormTextarea,
    BAlert,
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
    prop: 'isEditConsultingSidebarActive',
    event: 'update:is-edit-consulting-sidebar-active',
  },
  props: {
    isEditConsultingSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedConsulting: {
      type: Object,
      default: () => (null),
    },
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
      },
      loading: false,
      error: false,
      error_message: '',
    }
  },
  created() {
    this.form = this.selectedConsulting
  },
  methods: {
    update() {
      const app = this
      app.loading = true
      const updateCurriculumSetupResource = new Resource('consultings/update')
      const param = app.form
      updateCurriculumSetupResource.update(param.id, param)
        .then(response => {
          app.loading = false
          app.$emit('update', response)
          app.$emit('update:is-edit-consulting-sidebar-active', false)
        }).catch(() => {
          app.$alert('An error occured. A duplicate entry is probably detected.')
          app.loading = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
