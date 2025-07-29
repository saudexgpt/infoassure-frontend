<template>
  <el-row v-loading="creating" :gutter="20">
    <el-col :md="24">
      <label>Asset Name</label>
      <el-select
        v-model="form.name"
        filterable
        allow-create
        remote
        reserve-keyword
        clearable
        placeholder="Example: Laptop, Router, Switches, etc"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 100%"
      >
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <!-- <el-select
        v-model="form.name"
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
      </el-select> -->
      <p></p>
      <label>Asset Description</label>
      <el-input
        v-model="form.description"
        placeholder="Briefly describe this asset"
        type="textarea"
        maxlength="300"
        show-word-limit
        style="width: 100%"
      />
      <p></p>
      <label>Asset Classification</label>
      <el-select
        v-model="form.classification"
        filterable
        placeholder="Classification"
        style="width: 100%"
      >
        <el-option
          v-for="item in ['Public', 'Internal', 'Confidential', 'Restricted']"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <p></p>
    </el-col>
    <el-col :md="24">
      <label>Purpose of the asset</label>
      <el-input
        v-model="form.purpose"
        placeholder="Briefly state the purpose of this asset"
        type="text"
        style="width: 100%"
      />
      <p></p>
      <label>Type of information stored</label>
      <el-select v-model="form.information_stored" filterable style="width: 100%">
        <el-option
          v-for="item in [
            'Personal Data',
            'Sensitive Personal Data',
            'Commercial Data',
            'Intellectual Property'
          ]"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <p></p>
      <label>Location of the asset</label>
      <p></p>
      <el-radio-group v-model="form.location_type">
        <el-radio label="Physical" border> Physical </el-radio>
        <el-radio label="Virtual" border> Virtual </el-radio>
        <el-radio label="Remote" border> Remote </el-radio>
      </el-radio-group>
      <p></p>
      <el-input
        v-if="form.location_type !== ''"
        v-model="form.location"
        placeholder="Where is the asset located?"
        type="text"
        style="width: 100%"
      />
    </el-col>
    <el-col :md="24">
      <p></p>
      <el-button type="success" @click="submit()"> Submit </el-button>
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    assetTypeId: {
      type: Number,
      default: null
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
      form: {
        name: '',
        description: '',
        purpose: '',
        classification: '',
        information_stored: '',
        location: '',
        location_type: ''
      },
      createModal: false,
      assetsList: [{ name: 'Laptop' }, { name: 'Router' }, { name: 'Switches' }],
      options: []
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
    // assetsList() {
    //   return this.$store.getters.assetsList
    // },
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.assetsList.filter(
            (item) => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        }, 200)
      } else {
        this.options = []
      }
    },
    submit() {
      this.creating = true
      const formData = this.form
      formData.client_id = this.clientId
      formData.asset_type_id = this.assetTypeId
      formData.location = `${formData.location_type} - ${formData.location}`
      const updatePhotoResource = new Resource('assets/save-assets')
      updatePhotoResource
        .store(formData)
        .then(() => {
          this.creating = false
          this.form = { names: [] }
          this.$message('Submitted')
          this.$emit('save')
        })
        .catch((e) => {
          this.creating = false
          this.$message(e.response.data.message)
        })
    }
  }
}
</script>
