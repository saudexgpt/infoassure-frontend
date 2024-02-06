<template>
  <el-card>
    <b-tabs
      vertical
      content-class="mt-1"
    >
      <b-tab
        lazy
        title="Areas"
      >
        <areas />
      </b-tab>
      <b-tab
        lazy
        title="Controls"
      >
        <controls />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import checkPermission from '@/utils/permission'
import Areas from './Areas.vue'
import Controls from './Controls.vue'

export default {
  components: {
    BTabs,
    BTab,
    Areas,
    Controls,
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
