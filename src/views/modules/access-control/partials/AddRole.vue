<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isCreateRoleSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-create-role-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Create Role
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

            <!-- Role Name -->
            <b-col cols="12">
              <b-form-group
                label="Role Name"
                label-for="v-role"
              >
                <b-form-input
                  v-model="form.name"
                  placeholder="Enter role..."
                />
              </b-form-group>
            </b-col>
            <!-- Abbrev -->
            <b-col cols="12">
              <b-form-group
                label="Role Description"
                label-for="v-role"
              >
                <b-form-input
                  v-model="form.description"
                  placeholder="Briefly describe role..."
                />
              </b-form-group>
            </b-col>
            <b-col
              v-if="curriculum_level_groups.length > 0"
              cols="12"
            >
              <b-form-group
                label="Select Level Group"
                label-for="v-curriculum"
              >
                <el-select
                  v-model="form.level_groups"
                  multiple
                  collapse-tags
                  style="width: 100%;"
                  placeholder="Select Level Group"
                >
                  <el-option
                    v-for="(curriculum_level_group, index) in curriculum_level_groups"
                    :key="index"
                    :label="curriculum_level_group.name"
                    :value="curriculum_level_group.id"
                  />
                </el-select>
              </b-form-group>
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
    prop: 'isCreateRoleSidebarActive',
    event: 'update:is-create-role-sidebar-active',
  },
  props: {
    isCreateRoleSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        level_groups: [],
      },
      loading: false,
      error: false,
      error_message: '',
      curriculum_level_groups: [],
    }
  },
  created() {
    this.fetchCurriculumLevels()
  },
  methods: {
    fetchCurriculumLevels() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('school-setup/fetch-specific-curriculum-level-groups')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.curriculum_level_groups = response.curriculum_level_groups
        })
    },
    submit() {
      const app = this
      app.loading = true
      const saveRoleResource = new Resource('acl/roles/save')
      const param = app.form
      saveRoleResource.store(param)
        .then(response => {
          app.loading = false
          app.$emit('save', response.roles)
          app.$emit('update:is-create-role-sidebar-active', false)
        }).catch(error => {
          app.error = true
          app.$message(error.response.data.message)
          app.loading = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
