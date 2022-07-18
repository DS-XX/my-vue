import services from '../config/axios'
import base from './index' // 导入接口域名列表
const newTableAPI = {
    list(){
        return services.post(`${base.localhost}/newTable/list`)
    },
    suppliers(){
        return services.post(`${base.localhost}/newTable/suppliers`)
    },
    submitTable(params){
        return services.post(`${base.localhost}/newTable/submitTable`,params)
    },
}
export default newTableAPI