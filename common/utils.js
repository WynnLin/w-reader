export default utils = {
	formatTime: (time) => {
		// 一年 一月 一周 一天 一小时 一分钟 一秒
		let timeUnit = {
			'年': 31536000000,
			'月': 2592000000,
			'天': 86400000,
			'小时': 3600000,
			'分钟': 60000,
			'秒': 1000
		}
		for (let unit in timeUnit) {
			if (time > timeUnit[unit]) {
				return `${Math.floor(time / timeUnit[unit])}${unit}`
			}
		}
		return '1 秒前'
	},

	formatQueryString (param) {
		let str = ''
		for(let key in param) {
			str += `${key}=${param[key]}&`
		}
		return str.slice(0, -1)
	},

	setItem (key, data, id) {
		storage.save({
	    key: key,
	    id: id,
	    data: data
	  });
	},

	async getItem (key, id) {
		try {
			let data = await storage.load({
		    key: key,
		    id: id
		  });
		  return data
		  console.log('data', data);
		} catch (err) {
			//如果没有找到数据且没有sync方法，
	    //或者有其他异常，则在catch中返回
			console.log(err.message);
			switch (err.name) {
		    case 'NotFoundError':
	        // TODO;
	        break;
        case 'ExpiredError':
          // TODO
          break;
			}
			return false
		}
	},

	async getItemByKey (key) {
		const data = await storage.getAllDataForKey(key)
		console.log(`data+++======${key}`, data)
		return data
	}
}