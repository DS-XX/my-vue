/*
    * 网站管理接口
    * */
import services from '../config/axios'
import base from './index' // 导入接口域名列表
const websiteManageAPI = {
  // 登录
  login (params) {
    return services.post(`${base.localhost}/user/login`, params)
  },
  // 测试post接口
  getUser (params) {
    return services.get(`${base.localhost}/user/list`, params)
  },
  // 测试get接口
  getJSON (pageNo, pageSize) {
    return services.get(`${base.localhost}/getter/getJSON`, {params: {pageNo: pageNo, pageSize: pageSize}})
  },
  // 测试get接口
  createName (params) {
    return services.post(`${base.localhost}/user/createName`, params)
  }
}

export default websiteManageAPI
