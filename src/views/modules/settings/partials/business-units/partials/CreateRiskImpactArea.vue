<template>
  <div class="justify-content-between align-items-center px-2 py-1">
    <el-row v-loading="loading">
      <el-col cols="12">
        <el-form-group
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
              v-for="item in [
                'Financial Impact',
                'Health & Safety Impact',
                'Reputational Impact',
                'Legal Impact',
                'Stakeholders Impact',
                'People Impact',
                'Operational Impact',
                'Regulatory Impact'
              ]"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-group>
      </el-col>
      <!-- submit and reset -->
      <el-col cols="12">
        <el-button :loading="creating" type="primary" style="width: 100%" @click="submit()">
          Submit
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  model: {
    prop: 'isCreateSidebarActive',
    event: 'update:is-create-sidebar-active'
  },
  props: {
    isCreateSidebarActive: {
      type: Boolean,
      required: true
    },
    clientId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      creating: false,
      pageLength: 10,
      dir: false,
      assets: [],
      form: { areas: [] }
    }
  },
  methods: {
    submit() {
      this.creating = true
      const formData = this.form
      formData.client_id = this.clientId
      const storeResource = new Resource('store-risk-impact-area')
      storeResource
        .store(formData)
        .then(() => {
          this.creating = false
          this.form = { areas: [] }
          this.$message({
            message: 'Submitted Successfully',
            type: 'success'
          })
          this.$emit('save')
          this.$emit('update:is-create-sidebar-active', false)
        })
        .catch((e) => {
          this.creating = false
          this.$message(e.response.data.message)
        })
    }
  }
}
</script>
