/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validMobile(str) {
  // 正则.test（要校验的字符串），如果字符串被正则匹配成功，那么test返回true，否则返回false
  return /^1[3-9]\d{9}$/.test(str)
}
