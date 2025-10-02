class Component {
	name

	constructor(name) {
		this.name = name
	}

}

class App extends Component {
	static instance

	maxPoints = {
		attributes: {
			0: 0,
			1: 7,
			2: 5,
			3: 3
		},
		skills: {
			0: 0,
			1: 13,
			2: 9,
			3: 5
		}
	}

	orderNumber = 1

	static get() {
		if (!App.instance) {
			App.instance = new App('app')
			App.instance.initStore()
		}
		return App.instance
	}

	initStore() {
		Alpine.store('state', {
			sections: {
				head: {
					groups: {
						game: {
							elements: {
								name: this.getHeadInitElement('name', 'Имя'),
								player: this.getHeadInitElement('player', 'Игрок'),
								chronicle: this.getHeadInitElement('chronicle', 'Хроника')
							}
						},
						person: {
							elements: {
								nature: this.getHeadInitElement('nature', 'Натура'),
								mask: this.getHeadInitElement('mask', 'Маска'),
								clan: this.getHeadInitElement('clan', 'Клан')
							}
						},
						vampire: {
							elements: {
								generation: this.getHeadInitElement('generation', 'Поколение'),
								shelter: this.getHeadInitElement('shelter', 'Убежище'),
								concept: this.getHeadInitElement('concept', 'Концепт')
							}
						}
					}
				},
				attributes: {
					name: 'Атрибуты',
					groups: {
						physical: {
							name: 'Физические',
							data: this.getGroupInitData('attributes'),
							elements: {
								strength: this.getAttribute('attributes', 'strength', 'Сила'),
								agility: this.getAttribute('attributes', 'agility', 'Ловкость'),
								stamina: this.getAttribute('attributes', 'stamina', 'Выносливость'),
							}
						},
						social: {
							name: 'Социальные',
							data: this.getGroupInitData('attributes'),
							elements: {
								charm: this.getAttribute('attributes', 'charm', 'Обаяние'),
								manipulation: this.getAttribute('attributes', 'manipulation', 'Манипуляция'),
								appearance: this.getAttribute('attributes', 'appearance', 'Внешность'),
							}
						},
						mental: {
							name: 'Ментальные',
							data: this.getGroupInitData('attributes'),
							elements: {
								perception: this.getAttribute('attributes', 'perception', 'Восприятие'),
								intelligence: this.getAttribute('attributes', 'intelligence', 'Интеллект'),
								savvy: this.getAttribute('attributes', 'savvy', 'Смекалка'),
							}
						}
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

	getElementValue(section, group, element) {
		return this.getState().sections[section].groups[group].elements[element].value
	}

	setElementValue(section, group, element, value) {
		this.getState().sections[section].groups[group].elements[element].value = value
	}

	getGroupInitData(section) {
		if (section === 'skills' && this.orderNumber === 4) {
			this.orderNumber = 1
		}
		return {
			isNeed: section === 'attributes' || section === 'skills',
			points: {
				current: 0,
				max: this.maxPoints[section][this.orderNumber]
			},
			orderNumber: this.orderNumber++
		}
	}

	handleSelectImportance(sectionKey, groupKey, value) {
		// debugger;
		const newOrderNumber = Number.parseInt(value)

		if (newOrderNumber !== 0) {
			for (let group of Object.keys(this.getSectionGroups(sectionKey))) {
				if (this.getGroupData(sectionKey, group).orderNumber === newOrderNumber && group !== groupKey) {
					this.getGroupData(sectionKey, group).orderNumber = 0
				}
			}
		}
		this.getGroupData(sectionKey, groupKey).orderNumber = newOrderNumber
		this.getGroupData(sectionKey, groupKey).points.max = this.maxPoints[sectionKey][newOrderNumber]

	}

	handleIncrementTraitValue(sectionKey, groupKey, elementKey, newValue, oldValue) {
		let newValuePermanent = Number.parseInt(newValue)
		if (Number.isNaN(newValuePermanent)) {
			newValuePermanent = 0
			this.getElementValue(sectionKey, groupKey, elementKey).permanent = newValuePermanent
		}
		let oldValuePermanent = Number.parseInt(oldValue)
		if (Number.isNaN(oldValuePermanent)) {
			oldValuePermanent = 0
		}
		if (
			newValuePermanent === oldValuePermanent
			|| (newValuePermanent === 0 && oldValuePermanent < 0)
		) {
			return;
		}
		let diff = (newValuePermanent - oldValuePermanent)
		if (newValuePermanent < 0) {
			newValuePermanent = 0
			diff = 0
			this.getElementValue(sectionKey, groupKey, elementKey).permanent = newValuePermanent
		}
		this.getGroupData(sectionKey, groupKey).points.current += diff
		this.getElementValue(sectionKey, groupKey, elementKey).temporary = newValuePermanent
	}

	getSectionGroups(section) {
		return this.getState().sections[section].groups
	}

	getGroupData(section, group) {
		return this.getState().sections[section].groups[group].data
	}

	getAttribute(section, code, name, type = 'points') {
		return {
			name: name,
			value: {
				permanent: section === 'attributes' ? 1 : 0,
				temporary: section === 'attributes' ? 1 : 0
			},
			type: this.getType(type)
		}
	}

	getHeadInitElement(code, name) {
		return {
			name: name,
			value: code === 'generation' ? 13 : '',
			type: this.getType(code === 'generation' ? 'number' : 'text'),
		}
	}

	getType(type = 'number') {
		if (type === 'points') {
			return {
				typeCode: type,
				maxLength: 5
			}
		}
		if (type === 'text' || type === 'number') {
			return {
				typeCode: type
			}
		}
		throw new Error('Not Implemented!')
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