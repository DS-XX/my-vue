import services from '../config/axios'
import base from './index' // 导入接口域名列表
const tagsAPI = {
    searchAll(){
        return services.get(`${base.localhost}/tags/list`)
    },
    createTagsList(parmas){
        return services.post(`${base.localhost}/tags/createTagsList`,parmas)
    }
}
export default tagsAPI