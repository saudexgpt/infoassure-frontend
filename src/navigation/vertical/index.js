/*

Array of object

Top level object can be:
1. Header
2. Group (Group can have navItems as children)
3. navItem

* Supported Options

/--- Header ---/

header

/--- nav Grp ---/

title
icon (if it's on top level)
tag
tagVariant
children

/--- nav Item ---/

icon (if it's on top level)
title
route: [route_obj/route_name] (I have to resolve name somehow from the route obj)
tag
tagVariant

*/
/// //////////////////// THIS CODE STRUCTURE HAS BEEN MOVED TO ENABLE VUEX STORAGE VIA store/navItems.js and initiated from APP.vue ///////////////////////

// import appsAndPages from './apps-and-pages'
// import dashboard from './nav-modules/dashboard'
// import appSetup from './nav-modules/app-setup'
// import links from './nav-modules/links'
// import adminSettings from './nav-modules/admin-settings'
// import riskAssessment from './nav-modules/risk-assessment'
// import availableModules from './nav-modules/available-modules'
// import userManagement from './nav-modules/user-management'

// // Array of sections
// export default [...dashboard, ...appSetup, ...availableModules, ...riskAssessment, ...links, ...userManagement, ...adminSettings]

/// //////////////////// THIS CODE STRUCTURE HAS BEEN MOVED TO ENABLE VUEX STORAGE VIA store/navItems.js and accessed from APP.vue ///////////////////////
