// Theme Colors
// Initially this will be blank. Later on when app is initialized we will assign bootstrap colors to this from CSS variables.
export const $themeColors = {}

// App Breakpoints
// Initially this will be blank. Later on when app is initialized we will assign bootstrap breakpoints to this object from CSS variables.
export const $themeBreakpoints = {}

// APP CONFIG
export const $themeConfig = {
  app: {
    appName: 'DeCompass', // Will update name in navigation menu (Branding)
    appSlug: 'compliance made easy',
    // eslint-disable-next-line global-require
    appLogoImage: require('@/assets/images/logo/decompass.jpg'), // Will update logo in navigation menu (Branding)
    companyUrl: 'https://decompass.com',
  },
  layout: {
    isRTL: false,
    skin: 'semi-dark', // light, dark, bordered, semi-dark
    routerTransition: 'zoom-out', // zoom-fade, slide-fade, fade-bottom, fade, zoom-out, none
    type: 'vertical', // vertical, horizontal
    contentWidth: 'full', // full, boxed
    menu: {
      hidden: false,
      isCollapsed: true,
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: 'sticky', // static , sticky , floating, hidden
      backgroundColor: 'primary', // BS color options [primary, success, etc]
    },
    footer: {
      type: 'sticky', // static, sticky, hidden
    },
    customizer: true,
    enableScrollToTop: true,
  },
}
