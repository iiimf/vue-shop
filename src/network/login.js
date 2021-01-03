import {request} from "./request.js"
export function Login(username,password){
	return request({
		url:"/login",
		params:{
			username:username,
			password:password
		},
		method:"post"
	})
}