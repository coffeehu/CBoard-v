import axios from 'axios';

const req = {
	get(url) {
		return axios.get(url);
	}
}

export default req;