<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isEditRoleSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-edit-level-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Edit Role
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
          class="justify-content-between align-items-center px-2 py-1"
        >
          <b-row v-loading="loading">

            <!-- Role Name -->
            <b-col cols="12">
              <b-form-group
                label="Role Name"
                label-for="role"
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
                label="Role Abbreviation"
                label-for="description"
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
                @click="update()"
              >
                Update
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
    prop: 'isEditRoleSidebarActive',
    event: 'update:is-edit-level-sidebar-active',
  },
  props: {
    isEditRoleSidebarActive: {
      type: Boolean,
      required: true,
    },
    selectedRole: {
      type: Object,
      default: () => (null),
    },
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        description: '',
        level_groups: [],
      },
      loading: false,
      curriculum_level_groups: [],
    }
  },
  created() {
    this.form.id = this.selectedRole.id
    this.form.name = this.selectedRole.name
    this.form.description = this.selectedRole.description
    this.fetchCurriculumLevels()
  },
  methods: {
    fetchCurriculumLevels() {
      const app = this
      const fetchCurriculumSetupResource = new Resource('school-setup/fetch-specific-curriculum-level-groups')
      fetchCurriculumSetupResource.list()
        .then(response => {
          app.curriculum_level_groups = response.curriculum_level_groups

          app.form.level_groups = (app.selectedRole.curriculum_level_group_ids) ? app.selectedRole.curriculum_level_group_ids.split('~').map(item => parseInt(item, 10)) : []
        })
    },
    update() {
      const app = this
      app.loading = true
      const updateCurriculumSetupResource = new Resource('acl/roles/update')
      const param = app.form
      updateCurriculumSetupResource.update(param.id, param)
        .then(response => {
          app.loading = false
          app.$emit('update', response.roles)
          app.$emit('update:is-edit-level-sidebar-active', false)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
