"use babel";

export function getObject({keys, obj}){
  return keys.reduce(function(ret, key) {
    if( ret && ret.hasOwnProperty(key) ) return ret[key];
    return false;
  }, obj);
}
