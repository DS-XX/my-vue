/**
    * api统一出口
    * */
// 网站管理接口
import loginAPI from './loginAPI.js'
import tagsAPI from './tagsAPI'
import nodeAPI from './nodeAPI'
import newTableAPI from './newTableAPI'

// 其他模块接口

// 导出接口
export default {
  loginAPI,
  tagsAPI,
  nodeAPI,
  newTableAPI
  // ...
}
