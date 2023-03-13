const regexMap = {
  hexColor: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
}

/**
 *
 * @param pattern {string} ['hexColor']
 * @param value {string}
 * @returns {*|null}
 */
export const useTest = (pattern, value) => {
  if (!regexMap[pattern]) return null
  return regexMap[pattern].test(value)
}

export const useMatch = (pattern, value) => {

}