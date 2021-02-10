import axios from 'axios'
import {api_url} from '../../Config'

let CategoryApi = {
	
	async get() {
		let res = await axios.get(`${api_url}/categories`);
		return res
	},

	async delete(id) {
		let res = await axios.delete(`${api_url}/categories/${id}`);
		return res
	},

	async update(categoryId, value) {
		let res = await axios.put(`${api_url}/categories/${categoryId}`, {name: value})
		return res 
	},

	async create(name, description) {
		let res = await axios.post(`${api_url}/categories`, {name: name, description: description})
		return res
	},

	async updateOrderNumbers(categories) {
		let res = await axios.put(`${api_url}/categories/update/order_numbers`, categories);
		return res;
	},

	async find(search) {
		let res = await axios.get(`${api_url}/categories/search/${search}`);
		return res;
	}
}

export default CategoryApi