/* All validations should be defined here */

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * Validate a valid URL
 * @param {String} textval
 * @return {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * Validate a full-lowercase string
 * @return {Boolean}
 * @param {String} str
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * Validate a full-uppercase string
 * @return {Boolean}
 * @param {String} str
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * Check if a string contains only alphabet
 * @param {String} str
 * @param {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * Validate an email address
 * @param {String} email
 * @return {Boolean}
 */
export function validEmail(email) {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  // const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  return re.test(email)
}

export function amountInWords(n) {
  let string = n.toString()
  let start; let end; let chunk; let ints; let i; let word; const and = 'and'

  /* Remove spaces and commas */
  string = string.replace(/[, ]/g, '')

  /* Is number zero? */
  // eslint-disable-next-line radix
  if (parseInt(string) === 0) {
    return 'zero'
  }

  /* Array of units as words */
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']

  /* Array of tens as words */
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

  /* Array of scales as words */
  const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion']

  /* Split user argument into 3 digit chunks from right to left */
  start = string.length
  const chunks = []
  while (start > 0) {
    end = start
    chunks.push(string.slice((start = Math.max(0, start - 3)), end))
  }

  /* Check if function has enough scale words to be able to stringify the user argument */
  const chunksLen = chunks.length
  if (chunksLen > scales.length) {
    return ''
  }

  /* Stringify each integer in each chunk */
  const words = []
  // eslint-disable-next-line no-plusplus
  for (i = 0; i < chunksLen; i++) {
    // eslint-disable-next-line radix
    chunk = parseInt(chunks[i])

    if (chunk) {
      /* Split chunk into array of individual integers */
      ints = chunks[i].split('').reverse().map(parseFloat)

      /* If tens integer is 1, i.e. 10, then add 10 to units integer */
      if (ints[1] === 1) {
        ints[0] += 10
      }

      /* Add scale word if chunk is not zero and array item exists */
      if ((word === scales[i])) {
        words.push(word)
      }

      /* Add unit word if array item exists */
      if ((word === units[ints[0]])) {
        words.push(word)
      }

      /* Add tens word if array item exists */
      if ((word === tens[ints[1]])) {
        words.push(word)
      }

      /* Add 'and' string after units or tens integer if: */
      if (ints[0] || ints[1]) {
        /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
        if ((ints[2] || !i) && chunksLen) {
          words.push(and)
        }
      }

      /* Add hundreds word if array item exists */
      if ((word === units[ints[2]])) {
        words.push(`${word} hundred`)
      }
    }
  }

  return words.reverse().join(' ')
}
