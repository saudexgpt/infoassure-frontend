<template>
  <b-card
    v-if="data"
    class="card-congratulation-medal"
  >
    <h5>Welcome 🎉 </h5>
    <b-card-text class="font-small-10">
      <h3>{{ data.first_name }}</h3>
      {{ data.username }}
    </b-card-text>
    <p class="mb-75 mt-2 pt-50">
      <b-link><strong>Education is the bedrock of any society</strong></b-link>
    </p>
    <router-link
      to="/profile"
      class="text-white"
    >
      <b-button
        pill
        variant="gradient-primary"
      >
        View Profile
      </b-button>
    </router-link>
    <b-img
      v-if="data.gender.toUpperCase() === 'MALE'"
      :src="require('@/assets/images/Student_Success.png')"
      class="congratulation-medal"
      alt="Medal Pic"
    />
    <b-img
      v-else
      :src="require('@/assets/images/Student_Success.png')"
      class="congratulation-medal"
      alt="Medal Pic"
    />
  </b-card>

</template>

<script>
import {
  BCard, BImg, BCardText, BButton, BLink,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BImg,
    BCardText,
    BButton,
    BLink,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    currentClass: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
}
</script>
