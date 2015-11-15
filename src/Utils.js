import _isString from "lodash/lang/isString";
import _isFunction from "lodash/lang/isFunction";

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const isString = _isString;
export const isFunction = _isFunction;

