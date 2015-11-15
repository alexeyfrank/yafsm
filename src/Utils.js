import _isString from "lodash/lang/isString";
import _isArray from "lodash/lang/isArray";
import _isFunction from "lodash/lang/isFunction";
import _contains from "lodash/collection/contains";

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const isString = _isString;
export const isArray = _isArray;
export const isFunction = _isFunction;
export const contains = _contains;

