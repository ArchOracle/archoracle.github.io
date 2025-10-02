class TextField {
	label
	value

	constructor(label, value) {
		this.label = label
		this.value = value
	}

	setValue(value) {
		this.value = value
	}

	static get(label) {
		const instance = new TextField(label, '')
		return {
			instance: instance,
			setValue: instance.setValue
		}
	}
}

class Component {

}

class Head extends Component {
	fields

	constructor() {
		super();
		this.fields = [
			{
				name: 'Имя'
			},
			{
				name: 'Игрок'
			},
			{
				name: 'Хроника'
			},
			{
				name: 'Натура'
			},
			{
				name: 'Маска'
			},
			{
				name: 'Клан'
			},
			{
				name: 'Поколение'
			},
			{
				name: 'Убежище'
			},
			{
				name: 'Концепт'
			},
		]
	}

	static get() {
		return {
			instance: new Head()
		}
	}
}

class CharList {

}