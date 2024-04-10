import { get, post,put,postJson,del,deleteQuery,postFormData,getPath,postPath ,getSong} from './http'
export const userPageAPI =p  => get('/user/page',p);    