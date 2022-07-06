import services from '../config/axios'
import base from './index' // 导入接口域名列表
const nodeAPI = {
    test(){
        return services.get(`${base.localhost}/test`)
    },
    user(params){
        return services.get(`${base.localhost}/user?loginName=${params.name}`)
    },
    insertUser(params){
        return services.post(`${base.localhost}/insertUser`,params)
    },
    login(params){
        return services.post(`${base.localhost}/login`,params)
    },
    register(params){
        return services.post(`${base.localhost}/register`,params)
    },
    homePicture(params){
        return services.post(`${base.localhost}/homePicture`,params)
    }
}
export default nodeAPI