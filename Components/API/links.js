import axios from 'axios'
import {api_url} from '../../Config'

let LinkApi = {
	async create(categoryId, name, url) {
		let res = await axios.post(`${api_url}/links`, {categoryId: categoryId, name: name, url: url})
		return res;
	},

	async update(categoryId, linkId, name, url) {
 		let res = await axios.put(`${api_url}/links/${categoryId}`, {categoryId: categoryId, linkId: linkId, name: name, url: url})
 		return res;
	},

	async delete(linkId) {
		let res = await axios.delete(`${api_url}/links/${linkId}`)
		return res
	},

	async updateOrderNumbers(links) {

		let res = await axios.put(`${api_url}/links/update/order_numbers`, links).catch(err => console.log(err))
		return res
	},
}


export default LinkApi