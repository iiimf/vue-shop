import {request} from "./request.js"
export function Login(username,password){
	return request({
		url:"/api/private/v1/login",
		params:{
			username:username,
			password:password
		},
		method:"post"
	})
}