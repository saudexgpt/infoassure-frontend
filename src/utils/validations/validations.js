// import { defineRule } from 'vee-validate'
// import { ref } from 'vue'
// import { useField, useForm } from 'vee-validate'
import {
  required as requiredRule,
  email as emailRule,
  minLength as minRule,
  sameAs as sameAsRule,
  alphaNum as alphaNumRule
} from '@vuelidate/validators'

// ////////////////////////////////////////////////////////
// General
// ////////////////////////////////////////////////////////

// const { handleSubmit, handleReset } = useForm({
//   validationSchema: {
//     phone(value) {
//       if (/^[0-9-]{11,}$/.test(value)) return true

//       return 'Phone number needs to be at least 11 digits.'
//     },
//     // email(value) {
//     //   if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

//     //   return 'Must be a valid e-mail.'
//     // },
//     select(value) {
//       if (value) return true

//       return 'Select an item.'
//     },
//     checkbox(value) {
//       if (value === '1') return true

//       return 'Must be checked.'
//     },
//     password(value) {
//       const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
//       const validPassword = regExp.test(password)
//       if (validPassword) return true

//       return 'Password must contain at least one uppercase, one lowercase, one special character and one digit'
//     }
//   }
// })
export const phone = (value) => {
  return /^[0-9-]{11,}$/.test(value) === true || 'Phone number needs to be at least 11 digits.'
}
// export const select = useField('select')
// export const checkbox = useField('checkbox')
// export const password = useField('password')
export const required = requiredRule

export const email = emailRule

export const minLength = minRule

export const sameAs = sameAsRule

export const alphaNum = alphaNumRule

const validatorPassword = (password) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  const validPassword = regExp.test(password)
  if (!validPassword) {
    return 'Your {_field_} must contain at least one uppercase, one lowercase, one special character and one digit'
  }

  return true
}
export const password = (value) => {
  return validatorPassword(value)
}
// export const min = defineRule('min', rule_min)

// export const confirmed = defineRule('confirmed', rule_confirmed)

// export const regex = defineRule('regex', rule_regex)

// export const between = defineRule('between', rule_between)

// export const alpha = defineRule('alpha', rule_alpha)

// export const integer = defineRule('integer', rule_integer)

// export const digits = defineRule('digits', rule_digits)

// export const alphaDash = defineRule('alpha-dash', rule_alpha_dash)

// export const alphaNum = defineRule('alpha-num', rule_alpha_num)

// export const length = defineRule('length', rule_length)

// export const positive = defineRule('positive', {
//   validate: validatorPositive,
//   message: 'Please enter positive number!'
// })

// export const credit = (value) => {
//   return validatorCreditCard(value)
// }

// export const url = (value) => {
//   return validatorUrlValidator(value)
// }

// export const email = (value) => {
//   return validatorEmail(value)
// }

// export const confirmed = (value, target) => {
//   return validateConfirmation(value, target)
// }

// export const required = defineRule('required', (value) => {
//   return (val && val.length > 0) || '*Field is required'
// })

// ////////////////////////////////////////////////////////
// NOTE:
// Quasar validation for reference only
// Remove this note once development is finished and make sure to
// to convert all of them in veevalidate version
// ////////////////////////////////////////////////////////

// export const required = (val) => {
//   return (val && val.length > 0) || '*Field is required'
// }

// export const required_obj = (obj) => {
//   if (obj === null || obj === undefined) return '*Field is required'
//   return (Object.entries(obj).length > 0 && obj.constructor === Object) || '*Field is required'
// }

// export const no_blank_spaces_arr = (arr) => {
//   return arr.every(val => (val.trim() && val.trim().length > 0)) || 'Blank Spaces are not allowed'
// }

// export const url = val => {
//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   // Used
//   // https://stackoverflow.com/questions/4314741/url-regex-validation

//   // Other
//   // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
//   // https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php
//   // https://www.geeksforgeeks.org/how-to-validate-url-using-regular-expression-in-javascript/

//   /* eslint-disable no-useless-escape */
//   const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
//   /* eslint-enable no-useless-escape */
//   return re.test(val) || 'URL is invalid'
// }

// export const date = val => {

//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   // https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/patterns.js
//   return /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(val) || 'Date is invalid'
// }

// export const max = (val, max) => {

//   // If blank return
//   if (val === undefined || val === null) return true

//   return val.length <= max || `More than ${max} characters are not allowed`
// }

// export const max_arr = (val, max) => {
//   return val.length <= max || `More than ${max} values are not allowed`
// }

// export const min = (val, min) => {

//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   return val.length >= min || `Minimum ${min} characters are required`
// }

// export const num_range = (val, min, max) => {

//   // If blank return
//   if (val === undefined || val === null || val.length === 0) return true

//   const msg = 'Value is invalid'
//   if (min === null) return val <= max || msg
//   else if (max === null) return val >= min || msg
//   else return (val >= min && val <= max) || msg
// }
