<template>
  <el-card
    :id="id"
    style="cursor: pointer; margin-bottom: 5px"
    shadow="hover"
    @click="viewDetails(id)"
  >
    <div style="cursor: pointer">
      <strong><icon v-if="titleIcon" :icon="titleIcon" />{{ title }}</strong>
      <el-tag v-if="tagLabel !== ''" class="pull-right" effect="dark" type="success" round>
        {{ tagLabel }}
      </el-tag>
      <slot name="description"></slot>
    </div>
  </el-card>
</template>
<script>
import { changeOpacityOfHexaColorCode } from '@/utils/tsxHelper'

export default {
  components: {
    // BModal,
    // CreateAsset
    // EditAsset
  },
  props: {
    id: {
      type: String,
      default: () => null
    },
    title: {
      type: String,
      default: null
    },
    titleIcon: {
      type: String,
      default: null
    },
    tagLabel: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    viewDetails(viewId) {
      this.changeActiveTabBgColor(viewId)
    },
    changeActiveTabBgColor(viewId) {
      const root = document.documentElement // Get the root element (<html>)
      // root.style.setProperty('--el-color-primary', '#ff0000')
      const primaryBgColor = root.style.getPropertyValue('--el-color-primary')
      const divs = document.getElementsByClassName('el-card')
      // Loop through the buttons and add the activeCard class to the current/clicked button

      if (divs.length > 0) {
        for (let i = 0; i < divs.length; i++) {
          divs[i].style.background = '#ffffff'
          divs[i].style.color = '#000000'
        }
      }
      const doc = document.getElementById(viewId)
      if (doc !== undefined && doc !== null) {
        // Now we know that foo is defined, we are good to go.
        doc.style.background = changeOpacityOfHexaColorCode(primaryBgColor, 0.2)
      }
      this.$emit('clickToView', viewId)
      // document.getElementById(viewId).style.color = '#ffffff'
    }
  }
}
</script>
