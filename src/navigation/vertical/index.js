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
// import appsAndPages from './apps-and-pages'
import dashboard from './nav-modules/dashboard'
import appSetup from './nav-modules/app-setup'
// import accessControl from './nav-modules/access-control'
import links from './nav-modules/links'
import adminSettings from './nav-modules/admin-settings'
// import riskAssessment from './nav-modules/risk-assessment'
// import soa from './nav-modules/soa'
import rcsa from './nav-modules/rcsa'
import userManagement from './nav-modules/user-management'
// import uiElements from './ui-elements'
// import formAndTable from './forms-and-table'

// Array of sections
export default [...dashboard, ...appSetup, ...links, ...rcsa, ...userManagement, ...adminSettings]

// import store from '@/store'

// const Router = store.getters.permissionRoutes
// export default Router
