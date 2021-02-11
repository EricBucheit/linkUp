import {api_url} from '../../Config';
import axios from 'axios'
let Users = {

	async getCurrent() {
		let user = await axios.get(`${api_url}/users/user`).catch(err => console.log(err))
		return user;
	},

	async login(email, password) {
		let user = axios.post(`${api_url}/users/login`, {email: email, password: password}).catch(err => console.log(err))
		return user
	},

	async logout() {
		let res = axios.post(`${api_url}/users/logout`).catch(err => console.log(err))
		return res;
	},

	async register(email, password) {
		let user = axios.post(`${api_url}/users/register`, {email: email, password: password}).catch(err => console.log(err))
		return user;
	},
	async search(email) {
		console.log(email)
		let user = axios.get(`${api_url}/users/search/${email}`).catch(err => console.log(err))
		return user;
	},

}

export default Users;