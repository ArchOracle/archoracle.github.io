class Component {
	name

	constructor(name) {
		this.name = name
	}

}

class App extends Component{
	static instance

	static get() {
		if (!App.instance) {
			App.instance = new App('app')
			App.instance.init()
		}
		return App.instance
	}

	init() {
		Alpine.store('state', {
			sections: {
				head: {
					elements: {
						name: {
							name: 'name',
							label: 'Имя',
							value: ''
						},
						nature: {
							name: 'nature',
							label: 'Натура',
							value: ''
						},
						generation: {
							name: 'generation',
							label: 'Поколение',
							value: ''
						},
						player: {
							name: 'player',
							label: 'Игрок',
							value: ''
						},
						mask: {
							name: 'mask',
							label: 'Маска',
							value: ''
						},
						shelter: {
							name: 'shelter',
							label: 'Убежище',
							value: ''
						},
						chronicle: {
							name: 'chronicle',
							label: 'Хроника',
							value: ''
						},
						clan: {
							name: 'clan',
							label: 'Клан',
							value: ''
						},
						concept: {
							name: 'concept',
							label: 'Концепт',
							value: ''
						},
					}
				}
			}
		})
	}

	getState() {
		return Alpine.store('state')
	}

	setState(state) {
		Alpine.store('state', state)
	}
}

class Tools {
	static encodeBase64(str) {
		return btoa(unescape(encodeURIComponent(str)));
	}

	decodeBase64(str) {
		return decodeURIComponent(escape(atob(str)));
	}
}