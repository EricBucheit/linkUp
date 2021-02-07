let axios = require('axios')

axios.get('http://localhost:8080/categories').then(res => console.log(res.data.message + "CATEGORIES"));
axios.get('http://localhost:8080/links').then(res => console.log(res.data.message + "LINKS"));


async function test() {

	let register = await axios.post('http://localhost:8080/users/register', {email: "bucheiteric@gmail.com", password: "SOMEPASas12SWORD@*!^"});
	let login = await axios.post('http://localhost:8080/users/login', {email: "bucheiteric@gmail.com", password: "SOMEPASas12SWORD@*!^"});

	console.log(register.data);
	console.log(login.data)


	let res = await axios.post('http://localhost:8080/categories', {name: "NEW CATEGORY"})
	console.log(res.data);

	res = await axios.put('http://localhost:8080/categories/1', {name: "AnothaNewOne"});
	console.log(res.data);

	res = await axios.delete('http://localhost:8080/categories/1');
	console.log(res);

}
test()

