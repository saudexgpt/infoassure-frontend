<template>
  <div
    id="g-recaptcha"
    class="g-recaptcha"
    :data-sitekey="sitekey"
  />
</template>

<script>
export default {
  data() {
    return {
      sitekey: process.env.VUE_APP_MIX_RECAPTCHA_SITE_KEY,
      widgetId: 0,
    }
  },
  mounted() {
    // render the recaptcha widget when the component is mounted
    this.render()
  },
  methods: {
    execute() {
      window.grecaptcha.execute(this.widgetId)
    },
    reset() {
      window.grecaptcha.reset(this.widgetId)
    },
    render() {
      if (window.grecaptcha) {
        this.widgetId = window.grecaptcha.render('g-recaptcha', {
          sitekey: this.sitekey,
          size: 'checkbox', // 'checkbox'
          // the callback executed when the user solve the recaptcha
          callback: response => {
            // emit an event called verify with the response as payload
            this.$emit('verify', response)
            // reset the recaptcha widget so you can execute it again
            // this.reset()
          },
        })
      }
    },
  },
}
</script>
