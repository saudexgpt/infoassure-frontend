<template>
  <el-card>
    <b-tabs
      vertical
      content-class="mt-1"
    >
      <b-tab
        lazy
        title="Asset Types"
      >
        <asset-types />
      </b-tab>
      <b-tab
        lazy
        title="Categories"
      >
        <categories />
      </b-tab>
      <!-- <b-tab
        lazy
        title="Impacts"
      >
        <impacts />
      </b-tab>
      <b-tab
        lazy
        title="Likelihoods"
      >
        <likelihoods />
      </b-tab> -->
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
import AssetTypes from './AssetTypes.vue'
import Categories from './Categories.vue'
// import Likelihoods from './Likelihoods.vue'
// import Impacts from './Impacts.vue'

export default {
  components: {
    BTabs,
    BTab,
    AssetTypes,
    Categories,
    // Likelihoods,
    // Impacts,
  },
  data() {
    return {

    }
  },
  methods: {
    checkPermission,
  },
}
</script>
