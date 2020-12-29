import axios from "axios"
export function request(config){
	const instance1 = axios.create({
		baseURL:"http://127.0.0.1:8888",
		timeout:5000
	})
	//请求拦截器
	instance1.interceptors.request.use(config=>{
		return config
	},err=>{
		console.log(err);
	})

	//响应拦截器
	instance1.interceptors.response.use(res=>{
		return res.data
	},err=>{
		console.log(err);
	})

	return instance1(config)
}
