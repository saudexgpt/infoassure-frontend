<template>
  <el-card>
    <div v-loading="creating">
      <label>Type in the assets and hit enter to add more. Then click on the Submit button</label>
      <el-select
        v-model="form.names"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="Example: Laptop, Router, Switches, etc"
        style="width: 100%"
      >
        <el-option
          v-for="item in []"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <br>
      <b-button
        variant="success"
        class="btn-icon"
        @click="submit()"
      >
        Submit
      </b-button>
    </div>
  </el-card>
</template>

<script>
import {
  BButton,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    assetTypeId: {
      type: Number,
      default: null,
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
      form: { names: [] },
      createModal: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  methods: {
    submit() {
      const app = this
      app.creating = true
      const formData = app.form
      formData.client_id = app.clientId
      formData.asset_type_id = app.assetTypeId
      const updatePhotoResource = new Resource('risk-assessment/save-assets')
      updatePhotoResource.store(formData)
        .then(() => {
          app.creating = false
          app.form = { names: [] }
          app.$message('Submitted')
          app.$emit('save')
        })
        .catch(e => {
          app.creating = false
          app.$message(e.response.data.message)
        })
    },
  },
}
</script>
