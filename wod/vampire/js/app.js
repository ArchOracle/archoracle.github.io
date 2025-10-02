class Component {
	parent
}

class TextField extends Component{
	label
	value

	constructor(label, value) {
		super();
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

class Head extends Component {
	fields
	static instance

	constructor() {
		super();
		this.fields = [
			{
				name: 'Имя'
			},
			{
				name: 'Натура'
			},
			{
				name: 'Поколение'
			},
			{
				name: 'Игрок'
			},
			{
				name: 'Маска'
			},
			{
				name: 'Убежище'
			},
			{
				name: 'Хроника'
			},
			{
				name: 'Клан'
			},
			{
				name: 'Концепт'
			},
		]
	}

	static get() {
		if (!Head.instance) {
			Head.instance = new Head()
		}
		return {
			instance: Head.instance
		}
	}
}

class CharList {

}