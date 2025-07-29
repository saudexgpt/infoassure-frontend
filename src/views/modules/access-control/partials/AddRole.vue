<template>
  <div>
    <el-sidebar
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
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mel-0"> Create Role </h5>
          <div>
            <el-button variant="gradient-danger" class="btn-icon" @click="hide">
              <feather-icon icon="XIcon" />
            </el-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <el-row v-loading="loading">
            <!-- Role Name -->
            <el-col cols="12">
              <el-form-group label="Role Name" label-for="v-role">
                <el-form-input v-model="form.name" placeholder="Enter role..." />
              </el-form-group>
            </el-col>
            <!-- Abbrev -->
            <el-col cols="12">
              <el-form-group label="Role Description" label-for="v-role">
                <el-form-input v-model="form.description" placeholder="Briefly describe role..." />
              </el-form-group>
            </el-col>
            <el-col v-if="curriculum_level_groups.length > 0" cols="12">
              <el-form-group label="Select Level Group" label-for="v-curriculum">
                <el-select
                  v-model="form.level_groups"
                  multiple
                  collapse-tags
                  style="width: 100%"
                  placeholder="Select Level Group"
                >
                  <el-option
                    v-for="(curriculum_level_group, index) in curriculum_level_groups"
                    :key="index"
                    :label="curriculum_level_group.name"
                    :value="curriculum_level_group.id"
                  />
                </el-select>
              </el-form-group>
            </el-col>
            <!-- submit and reset -->
            <el-col cols="12">
              <el-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
              </el-button>
            </el-col>
            <el-col v-if="error" cols="12">
              <el-alert variant="danger" show>
                <div class="alert-body">
                  <span
                    ><strong>{{ error_message }}</strong></span
                  >
                </div>
              </el-alert>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-sidebar>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isCreateRoleSidebarActive',
    event: 'update:is-create-role-sidebar-active'
  },
  props: {
    isCreateRoleSidebarActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        level_groups: []
      },
      loading: false,
      error: false,
      error_message: '',
      curriculum_level_groups: []
    }
  },
  created() {
    this.fetchCurriculumLevels()
  },
  methods: {
    fetchCurriculumLevels() {
      const fetchCurriculumSetupResource = new Resource(
        'school-setup/fetch-specific-curriculum-level-groups'
      )
      fetchCurriculumSetupResource.list().then((response) => {
        this.curriculum_level_groups = response.curriculum_level_groups
      })
    },
    submit() {
      this.loading = true
      const saveRoleResource = new Resource('acl/roles/save')
      const param = this.form
      saveRoleResource
        .store(param)
        .then((response) => {
          this.loading = false
          this.$emit('save', response.roles)
          this.$emit('update:is-create-role-sidebar-active', false)
        })
        .catch((error) => {
          this.error = true
          this.$message(error.response.data.message)
          this.loading = false
        })
    }
  }
}
</script>
