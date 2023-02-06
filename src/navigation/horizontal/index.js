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
import dashboard from './nav-modules/dashboard'
import appsAndPages from './apps-and-pages'
import account from './nav-modules/account'
import assignment from './nav-modules/assignment'
import attendance from './nav-modules/attendance'
import results from './nav-modules/result'
import eLearning from './nav-modules/lms'
import timeTable from './nav-modules/time-table'
import adminSettings from './nav-modules/school-setup'
import appSetup from './nav-modules/app-setup'
import userManagement from './nav-modules/user-management'
import accessControl from './nav-modules/access-control'
import subjects from './nav-modules/subjects'
import classes from './nav-modules/classes'
import schools from './nav-modules/schools'
import materials from './nav-modules/materials'
import library from './nav-modules/library'
import packages from './nav-modules/packages'
import newsEvent from './nav-modules/news-event'
// import chartsAndMaps from './charts-and-maps'
// import uiElements from './ui-elements'
// import formAndTable from './forms-and-table'

// Array of sections
export default [...dashboard, ...appsAndPages, ...account, ...adminSettings, ...userManagement, ...appSetup, ...classes, ...subjects, ...assignment, ...attendance, ...results, ...materials, ...timeTable, ...newsEvent, ...eLearning, ...library, ...schools, ...packages, ...accessControl]

// import store from '@/store'

// const Router = store.getters.permissionRoutes
// export default Router
