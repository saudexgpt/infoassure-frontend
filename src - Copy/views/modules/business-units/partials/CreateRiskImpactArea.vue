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
            Create Risk Impact Areas
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
            <b-col
              cols="12"
            >
              <b-form-group
                label="Type in the impact areas and hit enter to add more. You can pick relevant ones from the dropdown."
              >
                <el-select
                  v-model="form.areas"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="Add/Select Risk Impact Areas"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in ['Financial Impact', 'Health & Safety Impact', 'Reputational Impact', 'Legal Impact', 'Stakeholders Impact', 'People Impact', 'Operational Impact', 'Regulatory Impact']"
                    :key="item"
                    :label="item"
                    :value="item"
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
    clientId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      creating: false,
      pageLength: 10,
      dir: false,
      assets: [],
      form: { areas: [] },
    }
  },
  methods: {
    submit() {
      const app = this
      app.creating = true
      const formData = app.form
      formData.client_id = app.clientId
      const storeResource = new Resource('store-risk-impact-area')
      storeResource.store(formData)
        .then(() => {
          app.creating = false
          app.form = { areas: [] }
          app.$message({
            message: 'Submitted Successfully',
            type: 'success',
          })
          app.$emit('save')
          app.$emit('update:is-create-sidebar-active', false)
        })
        .catch(e => {
          app.creating = false
          app.$message(e.response.data.message)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
