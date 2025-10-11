class DataStorage {
	static humanityPathList = {
		humanity: {
			code: 'humanity',
			name: 'Человечность',
			virtues: ['consciousness', 'self_control'],
			description: 'Человечность это человечность. Вампиры, будьте людьми!'
		},
		kain: {
			code: 'kain',
			name: 'Путь Каина',
			virtues: ['conviction', 'instincts'],
			description: 'Идём к Первому Вампиру!'
		}
	}

	static damageTypeList = {
		none: {
			name: 'Цел',
			short: ' '
		},
		bashing: {
			name: 'Ударные',
			short: '/'
		},
		lethal: {
			name: 'Летальные',
			short: 'X'
		},
		aggravated: {
			name: 'Непоглощаемые (аграва)',
			short: '*'
		}
	}
}

class Component {
	componentName
	bindList

	constructor(componentName) {
		this.componentName = componentName
		this.bindList = {
			["@request.window"]: (event) => {
				this.handleRequest(event.detail)
			},
			"@response.window"(event) {
				this.handleResponse(event.detail)
			}
		}
		return Alpine.reactive(this)
	}

	addToBindList(attribute, value) {
		this.bindList[attribute] = value
		return this
	}

	sendRequest(data) {
		this.send('request', {
			data: data
		})
	}

	sendResponse(data) {
		this.send('response', {
			data: data
		})
	}

	send(type, payload) {
		this.$dispatch(type, payload)//Магия alpine, не спрашивайте
	}

	bind() {
		return () => {
			return this.bindList
		}
	}

	init() {}

	handleRequest(data) {
		console.log(['request', this.componentName, data])
	}

	handleResponse(data) {
		console.log(['response', this.componentName, data])
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

	sections = {
		head: SectionFactory.get('head'),
		attributes: SectionFactory.get('attributes'),
		skills: SectionFactory.get('skills'),
		advantages: SectionFactory.initSection('advantages', 'Преимущества', {
			additions: new Group('additions', 'Дополнения', {
				allies: new AdditionElement('allies', 'Союзники'),
				contacts: new AdditionElement('contacts', 'Связи'),
				fame: new AdditionElement('fame', 'Слава'),
				herd: new AdditionElement('herd', 'Стадо'),
				influence: new AdditionElement('influence', 'Влияние'),
				resources: new AdditionElement('resources', 'Ресурсы'),
				retainers: new AdditionElement('retainers', 'Последователи'),
				haven: new AdditionElement('haven', 'Убежище'),
				mask: new AdditionElement('mask', 'Маска'),
				status: new AdditionElement('status', 'Статус')
			}),
			disciplines: new DisciplinesGroup(),
			virtues: new Group('virtues', 'Добродетели', {
				consciousness: new Element('consciousness', 'Сознательность', {permanent: 1}, TypeFactory.get('points')),
				conviction: new Element('conviction', 'Убеждённость', {permanent: 0}, TypeFactory.get('points')),
				self_control: new Element('self_control', 'Самоконтроль', {permanent: 1}, TypeFactory.get('points')),
				instincts: new Element('instincts', 'Инстинкты', {permanent: 0}, TypeFactory.get('points')),
				courage: new Element('courage', 'Смелость', {permanent: 1}, TypeFactory.get('points')),
			})
		}),
		other: SectionFactory.initSection('other', '', {
			aspects: new AspectGroup(),
			humanity_willpower_blood: new Group('humanity_willpower_blood', '', {
				humanity: new HumanityPathElement(),
				willpower: new WillPowerElement(),
				blood: new Element('blood', 'Запас крови', 7, new Blood()),
			}),
			health: new HealthTrackGroup()
		})
	}

	static get() {
		if (!App.instance) {
			App.instance = new App('app')
		}
		return App.instance
	}

	/**
	 * Используется в raw-html, например в Clan (extends Type)
	 * */
	getClanList() {
		return {
			none: {
				code: 'none',
				name: 'Не выбрано',
				disciplines: [],
				description: 'Выберите клан!'
			},
			caitiff_generic: this.getClan(
				'caitiff_generic',
				'Каитифф (общий)',
				['celerity', 'potence', 'presence', 'fortitude'],
				'Каитиффы — вампиры без клана, часто с непредсказуемым характером. Их дисциплины разнообразны и зависят от происхождения.'
			),

			caitiff_feral: this.getClan(
				'caitiff_feral',
				'Каитифф дикий',
				['animalism', 'protean', 'fortitude'],
				'Дикие каитиффы ближе к природе и животным инстинктам. Часто агрессивны и непредсказуемы.'
			),

			caitiff_mystic: this.getClan(
				'caitiff_mystic',
				'Каитифф магический',
				['thaumaturgy', 'auspex', 'obfuscate'],
				'Каитиффы с магическими способностями. Их дисциплины могут включать элементы тауматургии и ясновидения.'
			),

			caitiff_urban: this.getClan(
				'caitiff_urban',
				'Каитифф городской',
				['obfuscate', 'presence', 'celerity'],
				'Городские каитиффы умеют маскироваться и влиять на людей, часто живут среди смертных незаметно.'
			),
			brujah: this.getClan(
				'brujah',
				'Бруха',
				['celerity', 'potence', 'presence', 'dominate'],
				'Клан Бруха известен своей яростью, страстью и физической силой. Они часто выступают как бунтари и революционеры.'
			),

			gangrel: this.getClan(
				'gangrel',
				'Гангрел',
				['celerity', 'fortitude', 'protean', 'animalism'],
				'Гангрелы связаны с природой и животными, славятся выносливостью и способностью к превращениям.'
			),

			nosferatu: this.getClan(
				'nosferatu',
				'Носферату',
				['obfuscate', 'animalism', 'potence'],
				'Клан носферату известен уродством и скрытностью. Они мастера маскировки и сбора информации.'
			),

			tremere: this.getClan(
				'tremere',
				'Тремер',
				['thaumaturgy', 'dominate', 'auspex'],
				'Клан Тремеров практикует тауматургию и магические исследования, строго иерархичен и секретен.'
			),

			ventrue: this.getClan(
				'ventrue',
				'Вентру',
				['dominate', 'fortitude', 'presence', 'celerity'],
				'Клан Вентру известен своей элитарностью, лидерством и влиянием на общество и политику.'
			),

			malkavian: this.getClan(
				'malkavian',
				'Малкавиан',
				['auspex', 'dementation', 'obfuscate'],
				'Клан Малкавиан известен своим безумием и пророческими способностями, часто непредсказуем и странен.'
			),

			toreador: this.getClan(
				'toreador',
				'Тореадор',
				['auspex', 'celerity', 'presence'],
				'Тореадоры ценят искусство, красоту и культуру, имеют обострённое чувство эстетики.'
			),

			lasombra: this.getClan(
				'lasombra',
				'Ласомбра',
				['obtenebration', 'dominate', 'celerity'],
				'Ласомбра — клан тьмы и теней, мастера манипуляций и контроля.'
			),

			giovanni: this.getClan(
				'giovanni',
				'Джованни',
				['necromancy', 'vicissitude', 'potence'],
				'Клан Джованни специализируется на некромантии и управлении смертью, а также на финансовой власти.'
			),

			setite: this.getClan(
				'setite',
				'Сетиты',
				['serpentis', 'setite_sorcery'],
				'Сетиты — клан, практикующий магию Сета и скрытные манипуляции, известен соблазнением и интригами.'
			),

			assamite: this.getClan(
				'assamite',
				'Ассамиты',
				['quietus', 'assamite_sorcery'],
				'Ассамиты — клан убийц и магов, мастера тихой смерти и магических техник.'
			),

			ravnos: this.getClan(
				'ravnos',
				'Равнос',
				['chimerstry', 'koldunic_sorcery'],
				'Равнос — кочевой клан, мастера иллюзий и колдовства, любители обмана и путешествий.'
			)
		}
	}

	getClan(code, name, disciplines, description) {
		return {
			code: code,
			name: name,
			disciplines: disciplines,
			description: description
		}
	}

	init() {
		super.init()
		this.initStore()
	}

	initStore() {}

	handleSelectImportance(sectionKey, groupKey, value) {
		// debugger;
		const newOrderNumber = Number.parseInt(value)

		if (newOrderNumber !== 0) {
			for (let group of Object.keys(this.sections[sectionKey])) {
				if (this.getGroupData(sectionKey, group).orderNumber === newOrderNumber && group !== groupKey) {
					this.getGroupData(sectionKey, group).orderNumber = 0
				}
			}
		}
		this.getGroupData(sectionKey, groupKey).orderNumber = newOrderNumber
		this.getGroupData(sectionKey, groupKey).points.max = this.maxPoints[sectionKey][newOrderNumber]

	}



	getGroupData(section, group) {
		return this.sections[section].groups[group].data
	}
}

//region Секции

class SectionFactory {
	static sectionList = {
		head: () => new HeadSection(),
		attributes: () => (new AttributesSection()).setGroups(),
		skills: () => (new SkillsSection()).setGroups(),
	}

	static get(code) {
		return SectionFactory.sectionList[code]()
	}

	static initSection(code, name, groups) {
		return new Section(code, name, groups)
	}
}

class Section extends Component {

	code
	name
	groups

	constructor(code, name, groups) {
		super(code)
		this.code = code
		this.name = name
		this.groups = groups
	}

	initGroupData() {
		return {}
	}
}

class HeadSection extends Section {
	constructor() {
		super('head', '', {
			game: new Group('game', '', {
				name: new HeadElement('name', 'Имя'),
				player: new HeadElement('player', 'Игрок'),
				chronicle: new HeadElement('chronicle', 'Хроника')
			}),
			person: new Group('person', '', {
				nature: new HeadElement('nature', 'Натура'),
				mask: new HeadElement('mask', 'Маска'),
				clan: new HeadElement('clan', 'Клан')
			}),
			vampire: new Group('vampire', '', {
				generation: new HeadElement('generation', 'Поколение'),
				shelter: new HeadElement('shelter', 'Убежище'),
				concept: new HeadElement('concept', 'Концепт')
			})
		});
	}
}

class AttributesAndSkillsSection extends Section {
	orderNumber = 1
	initGroupData() {
		return {
			isNeed: true,
			points: {
				current: 0,
				max: this.maxPoints[this.orderNumber]
			},
			orderNumber: this.orderNumber++
		}
	}
}

class AttributesSection extends AttributesAndSkillsSection {
	maxPoints = {
		0: 0,
		1: 7,
		2: 5,
		3: 3
	}

	constructor() {
		super('attributes', 'Атрибуты', {});
	}

	setGroups() {
		this.groups = {
			physical: new Group('physical', 'Физические', {
				strength: new AttributeElement('strength', 'Сила'),
				agility: new AttributeElement('agility', 'Ловкость'),
				stamina: new AttributeElement('stamina', 'Выносливость'),
			}),
			social: new Group('social', 'Социальные', {
				charm: new AttributeElement('charm', 'Обаяние'),
				manipulation: new AttributeElement('manipulation', 'Манипуляция'),
				appearance: new AttributeElement('appearance', 'Внешность'),
			}),
			mental: new Group('mental', 'Ментальные', {
				perception: new AttributeElement('perception', 'Восприятие'),
				intelligence: new AttributeElement('intelligence', 'Интеллект'),
				savvy: new AttributeElement('savvy', 'Смекалка'),
			}),
		}
		this.groups.physical.data = this.initGroupData()
		this.groups.social.data = this.initGroupData()
		this.groups.mental.data = this.initGroupData()
		return this
	}
}

class SkillsSection extends AttributesAndSkillsSection {
	maxPoints = {
		0: 0,
		1: 13,
		2: 9,
		3: 5
	}

	constructor() {
		super('skills', 'Способности', {});
	}

	setGroups() {
		this.groups = {
			talents: new Group('talents', 'Таланты', {
				athletics: new SkillElement('athletics', 'Атлетика'),
				attention: new SkillElement('attention', 'Внимательность'),
				intimidation: new SkillElement('intimidation', 'Запугивание'),
				streetwise: new SkillElement('streetwise', 'Знание Улиц'),
				leadership: new SkillElement('leadership', 'Лидерство'),
				melee: new SkillElement('melee', 'Рукопашный Бой'),
				evasion: new SkillElement('evasion', 'Уклонение'),
				cunning: new SkillElement('cunning', 'Хитрость'),
				expression: new SkillElement('expression', 'Экспрессия'),
				empathy: new SkillElement('empathy', 'Эмпатия'),
			}),
			capabilities: new Group('capabilities', 'Навыки', {
				security: new SkillElement('security', 'Безопасность'),
				driving: new SkillElement('driving', 'Вождение'),
				survival: new SkillElement('survival', 'Выживание'),
				execution: new SkillElement('execution', 'Исполнение'),
				knowledge_animals: new SkillElement('knowledge_animals', 'Знание Животных'),
				crafts: new SkillElement('crafts', 'Ремесла'),
				stealth: new SkillElement('stealth', 'Скрытность'),
				shooting: new SkillElement('shooting', 'Стрельба'),
				fencing: new SkillElement('fencing', 'Фехтование'),
				etiquette: new SkillElement('etiquette', 'Этикет'),
			}),
			knowledge: new Group('knowledge', 'Познания', {
				academics: new SkillElement('academics', 'Академические'),
				laws: new SkillElement('laws', 'Законы'),
				computers: new SkillElement('computers', 'Компьютеры'),
				linguistics: new SkillElement('linguistics', 'Лингвистика'),
				medicine: new SkillElement('medicine', 'Медицина'),
				sciences: new SkillElement('sciences', 'Научные'),
				occult: new SkillElement('occult', 'Оккультизм'),
				politics: new SkillElement('politics', 'Политикa'),
				investigations: new SkillElement('investigations', 'Расследования'),
				finance: new SkillElement('finance', 'Финансы'),
			}),
		}

		this.groups.talents.data = this.initGroupData()
		this.groups.capabilities.data = this.initGroupData()
		this.groups.knowledge.data = this.initGroupData()
		return this
	}
}

//endregion

//region Классы групп

class Group extends Component {
	code
	name
	elements
	data
	constructor(code, name, elements) {
		super(code);
		this.code = code
		this.name = name
		this.elements = elements
		this.data = {}
	}
}

class DisciplinesGroup extends Group {
	constructor() {
		super('disciplines', 'Дисциплины', {
			animalism: new DisciplineElement(
				'animalism',
				'Анимализм',
				['gangrel', 'brujah', 'nosferatu'],
				[],
				[],
				'Дисциплина, управляющая животными и связанная с природными инстинктами.',
				false
			),
			auspex: new DisciplineElement(
				'auspex',
				'Ауспекс',
				['toreador', 'brujah', 'ravnos'],
				[],
				[],
				'Прорицание, расширение восприятия: ясновидение, астральные чувства, чтение аур и мыслей.',
				false
			),
			celerity: new DisciplineElement(
				'celerity',
				'Стремительность',
				['brujah', 'gangrel', 'lasombra'],
				[],
				[],
				'Сверхъестественная скорость — ускорение движений и реакции.',
				false
			),
			dominate: new DisciplineElement(
				'dominate',
				'Доминирование',
				['ventrue', 'tremere', 'lasombra'],
				[],
				[],
				'Манипуляция разумом: приказы, обязательства, контроль и внушение.',
				false
			),
			fortitude: new DisciplineElement(
				'fortitude',
				'Стойкость',
				['toreador', 'gangrel', 'ventrue'],
				[],
				[],
				'Устойчивость к урону, выживаемость и стойкость против сверхъестественных эффектов.',
				false
			),
			obfuscate: new DisciplineElement(
				'obfuscate',
				'Сокрытие',
				['nosferatu', 'malkavian', 'tremere'],
				[],
				[],
				'Скрытие присутствия: маскировка, иллюзии, умение оставаться незаметным.',
				false
			),
			potence: new DisciplineElement(
				'potence',
				'Могущество',
				['brujah', 'gangrel', 'followers'],
				[],
				[],
				'Физическая сила сверхчеловеческого уровня — усиление ударов, возможности ломать преграды.',
				false
			),
			presence: new DisciplineElement(
				'presence',
				'Присутствие',
				['toreador', 'ventrue', 'nosferatu'],
				[],
				[],
				'Влияние на эмоции и волю — очарование, вдохновение, страх.',
				false
			),
			protean: new DisciplineElement(
				'protean',
				'Превращение',
				['gangrel', 'brujah', 'lasombra'],
				['shapechange', 'claws', 'blooddrain'],
				[],
				'Дисциплина, позволяющая изменять форму: превращения, животные формы, когти.',
				false
			),
			thaumaturgy: new DisciplineElement(
				'thaumaturgy',
				'Тауматургия',
				['tremere'],
				['alchemy', 'biothaumaturgy', 'movement_of_the_mind', 'green_path', 'oneiromancy'],
				[],
				'Кровная магия Тремеров — протауматургическая система с множеством путей.',
				true
			),
			necromancy: new DisciplineElement(
				'necromancy',
				'Некромантия',
				['giovanni', 'tremere'],
				['cenotaph', 'bone', 'mortuus', 'ash', 'sepulchre', 'vitreous'],
				[],
				'Магия смерти: манипуляция душами, мёртвыми, путями смерти.',
				true
			),
			obtenebration: new DisciplineElement(
				'obtenebration',
				'Обтенебрация',
				['lasombra'],
				[],
				[],
				'Дисциплина Теней — управление тьмой и тенями, создание плотных теневых форм.',
				false
			),
			vicissitude: new DisciplineElement(
				'vicissitude',
				'Изменчивость',
				['giovanni'],
				[],
				[],
				'Изменение плоти и костей — дисциплина, дающая возможность модифицировать тело.',
				false
			),
			dementation: new DisciplineElement(
				'dementation',
				'Помешательство',
				['malkavian'],
				[],
				[],
				'Искажение сознания, провокация безумия, создание иллюзий и фобий.',
				false
			),
			melpominee: new DisciplineElement(
				'melpominee',
				'Мельпомения',
				[],
				[],
				[],
				'Дисциплина, связанная с музыкой, голосом и чарующим эффектом искусства.',
				false
			),
			koldunic_sorcery: new DisciplineElement(
				'koldunic_sorcery',
				'Колдовство',
				['ravnos'],
				['way_of_wind', 'way_of_water', 'way_of_spirit', 'way_of_earth', 'way_of_fire', 'way_of_sorrow'],
				[],
				'Колдовство кельтско-горных традиций; содержит «пути» (ветры, воды, духа, земли, огня и скорби).',
				true
			),
			assamite_sorcery: new DisciplineElement(
				'assamite_sorcery',
				'Чародейство Ассамитов',
				['assamite'],
				['hunters_winds', 'awakening_of_the_steel', 'whispers_of_the_heavens'],
				[],
				'Ассамитская традиция магии — набор путей и техник, основанных на боевых и мистических практиках.',
				true
			),
			setite_sorcery: new DisciplineElement(
				'setite_sorcery',
				'Чародейство Сеттитов',
				['setite'],
				['hand_of_god', 'union_with_set', 'serpent_temptation', 'dried_nile_path', 'duat_path', 'ushebti'],
				[],
				'Сетитовская магия, связанная с культом Сета; содержит несколько путей/школ.',
				true
			),
			spiritus: new DisciplineElement(
				'spiritus',
				'Шаманство',
				[],
				[],
				[],
				'Дисциплина, связанная с духами и шаманскими практиками; взаимодействие с духами, призыв и контроль.',
				false
			)});
	}
}

class AspectGroup extends Group {
	constructor() {
		super('aspects', 'Достоинства и недостатки', {});
		this.elements = this.initAspectList()
	}


	initAspectList() {
		let list = {}
		for (let i = 0; i < 9; i++) {
			list['aspect_' + i] = new Element(
				'aspect_' + i,
				'',
				0,
				TypeFactory.get('aspect')
			)
		}
		return list
	}
}

class HealthTrackGroup extends Group {
	damageLevel

	constructor() {
		super('health', 'Здоровье', {});
		this.elements =  this.initHealthTrack()
	}

	initHealthTrack() {
		const list = {}

		list['bruised'] = new HealthPointElement('bruised', 'Задет', 0)
		list['hurt'] = new HealthPointElement('hurt', 'Повреждён', -1)
		list['injured'] = new HealthPointElement('injured', 'Ранен', -1)
		list['wounded'] = new HealthPointElement('wounded', 'Тяжело ранен', -2)
		list['mauled'] = new HealthPointElement('mauled', 'Травмирован', -2)
		list['crippled'] = new HealthPointElement('crippled', 'Искалечен', -5)
		list['incapacitated'] = new HealthPointElement('incapacitated', 'Обездвижен', -99)
		list['torpor'] = new HealthPointElement('torpor', 'Торпор', -999)

		list['weakness'] = new WeaknessElement(
			'weakness',
			'Слабость',
			'',
			TypeFactory.get('weakness')
		)

		return list
	}

	init() {
		super.init();
		// this.addEventListener('damage_change', () => console.log('1'))
		// console.log(1)
		// this.$ref.addEventListener('damage_change', () => console.log('1'))
	}
}

//endregion

//region Классы элементов

class Element extends Component {
	code
	name
	value
	type
	constructor(code, name, value, type) {
		super(code)
		this.code = code
		this.name = name
		this.value = value
		this.type = type
	}

	get minLevel() {
		return 0
	}

	get maxLevel() {
		return 5
	}

	isShow() {
		return true
	}
}

class HeadElement extends Element {
	constructor(code, name) {
		const isGeneration = code === 'generation'
		const isClan = code === 'clan'
		const typeCode = isGeneration ? 'number' : (isClan ? 'clan' : 'text')
		const value = isGeneration ? 13 : (isClan ? 'none' : '')
		super(code, name, value, TypeFactory.get(typeCode));
		if (isClan) {
			this.addToBindList('x-effect', () => {
				if (this.value === 'nosferatu') {
					this.send('isNosferatu', {
						isNosferatu: true
					})
				}
			})
		}
	}
}

class AttributeOrSkillElement extends Element {
	minPermanentValue = 0
	maxPermanentValue = 5

	constructor(code, name, value) {
		super(code, name, value, TypeFactory.get('points'));
	}


	get minLevel() {
		return !!this.minPermanentValue ? this.minPermanentValue : 0
	}

	get maxLevel() {
		return !!this.maxPermanentValue ? this.maxPermanentValue : 5
	}
}

class AttributeElement extends AttributeOrSkillElement {

	constructor(code, name) {
		super(
			code,
			name,
			{
				temporary: 1,
				permanent: 1
			}
		);
		super.minPermanentValue = 1
		if (code === 'appearance') {
			this.addToBindList('@isNosferatu', (event) => {this.maxPermanentValue = 0})
		}
	}
}

class SkillElement extends AttributeOrSkillElement {

	constructor(code, name) {
		super(
			code,
			name,
			{
				temporary: 0,
				permanent: 0
			}
		);
		super.minPermanentValue = 0
	}
}

class AdditionElement extends Element {
	constructor(code, name) {
		super(
			code,
			name,
			{
				temporary: 0,
				permanent: 0
			},
			TypeFactory.get('points')
		);
	}
}

class DisciplineElement extends Element {
	clans
	paths
	variants
	description
	ritualSupport
	metadata
	isUnique

	#isShowFlag = true

	constructor(
		code,
		name,
		clans = [],     // array of strings: кланы, для которых дисциплина клановая
		paths = [],     // array of strings: пути / ветви дисциплины
		variants = [],  // array of strings: альтернативные версии / специализации
		description = '', // string: описание дисциплины
		ritualSupport = false, // boolean: поддержка ритуалов
		isUnique = false
	) {
		super(code, name, {permanent: 0, temporary: 0}, TypeFactory.get('discipline'));
		this.clans = clans
		this.paths = paths
		this.variants = variants
		this.description = description
		this.ritualSupport = ritualSupport
		this.isUnique = isUnique

		this.metadata = {
			isClanDiscipline: clans.length > 0,
			source: 'wod.su',
			description: description,
			ritualSupport: ritualSupport
		}
	}

	get maxLevel() {
		return 5
	}

	set show(isShowFlag) {
		this.#isShowFlag = !!isShowFlag
	}

	isShow() {
		return this.#isShowFlag
	}
}

class HumanityPathElement extends Element {
	constructor() {
		super('humanity_path', 'Человечность / Путь', {
			path: 'humanity',
			value: 5
		}, new HumanityPath());
	}
}

class WillPowerElement extends Element {
	constructor() {
		super('willpower', 'Сила Воли', {
			current: 5,
			permanent: 6
		}, new WillPower())
	}
}

class HealthPointElement extends Element {
	fine
	constructor(code, name, fine) {
		super(code, name, {
			damage_type: 'none'
		}, TypeFactory.get('health_point'));
		this.fine = fine
	}

	init() {
		super.init();
		Alpine.watch(
			() => this.value.damage_type,
			(value) => {
				this.send(
					'damage_change',
					{
						level: this.name,
						type: value
					}
				)
			}
		)
	}
}

class WeaknessElement extends Element{
	constructor() {
		super('weakness', 'Слабость', '', TypeFactory.get('weakness'));
	}
}

//endregion

class Tools {
	static encodeBase64(str) {
		return btoa(unescape(encodeURIComponent(str)));
	}

	decodeBase64(str) {
		return decodeURIComponent(escape(atob(str)));
	}
}

//region Типы элементов

class TypeFactory {
	static typeList = {
		text: () => new Text(),
		number: () => new NumberType(),
		points: () => new Points(),
		clan: () => new Clan(),
		discipline: () => new Points(),
		health_point: () => new HealthPoint(),
		weakness: () => new Weakness(),
		aspect: () => new Aspect()
	}
	static get(typeCode) {
		return TypeFactory.typeList[typeCode]()
	}
}

class Type {
	typeCode
	constructor(typeCode) {
		this.typeCode = typeCode
	}

	getRawHtml() {
		throw new Error('Not implement!')
	}
}

class Points extends Type {

	constructor() {
		super('points');
	}
	getRawHtml() {
		return `
			<span x-text="element.name"></span>
			<span>: </span>
			<div class="points" style="display: inline-block">
				<template x-for="i in element.maxLevel" :key="i">
					<input
							type="checkbox"
							:data-level="i"
							:checked="i <= element.value.permanent"
							@change="(event) => {element.value.permanent = event.target.dataset.level}"
					>
				</template>
			</div>
			`;
	}
}

class Text extends Type {
	constructor() {
		super('text');
	}

	getRawHtml() {
		return `
		<label>
			<span x-text="element.name"></span>
			<span>: </span>
			<input type="text" x-model="element.value" style="width: 100px">
		</label>
		`
	}
}

class NumberType extends Type {
	constructor() {
		super('number');
	}

	getRawHtml() {
		return `
		<label>
			<span x-text="element.name"></span>
			<span>: </span>
			<input type="number" x-model="element.value" style="width: 30px">
		</label>
		`
	}
}

class Clan extends Type {
	constructor() {
		super('clan');
	}

	getRawHtml() {
		return `
		<span x-text="element.name"></span>
		<span>: </span>
		<label>
			<select x-model="element.value">
				<template x-for="(clan, clanCode) in App.get().getClanList()"
						  :key="clanCode">
					<option :value="clanCode" x-text="clan.name"
							:title="clan.description"></option>
				</template>
			</select>
		</label>
		`
	}
}

class HealthPoint extends Type {
	constructor() {
		super('health_point');
	}

	getRawHtml() {
		return `
<div class="type type__health_point">
	<div class="health_point__name" x-text="element.name"></div>
	<div class="health_point__fine" x-text="element.fine > -10 ? element.fine : ''"></div>
	<select x-model="element.value.damage_type">
		<template x-for="(damageType, code) in DataStorage.damageTypeList" :key="code">
			<option :value="code" x-text="damageType.short" :title="damageType.name"></option>
		</template>
	</select>
</div>
		`
	}
}

class Weakness extends Type {
	constructor() {
		super('weakness');
	}

	getRawHtml() {
		return `
<div class="type type__weakness">
	<div class="name weakness__name" x-text="element.name"></div>
	<input type="text" x-model="element.value">
</div>
		`
	}
}

class Aspect extends Type {
	constructor() {
		super('aspect');
	}

	getRawHtml() {
		return `
		<input type="text" x-model="element.name" style="width: 170px">
		<span> ( </span>
		<input type="number" x-model="element.value" style="width: 30px">
		<span> ) </span>
		`;
	}
}

class HumanityPath extends Type {
	constructor() {
		super('humanity_path')
	}

	getRawHtml() {
		return `
<div class="type type__humanity_path">
	<div class="path_name" x-text="element.name"></div>
	<select x-model="element.value.path">
		<template x-for="(path, pathCode) in DataStorage.humanityPathList" :key="pathCode">
			<option :value="path.code" :title="path.description" x-text="path.name"></option>
		</template>
	</select>
	<div class="points_raw" x-data="">
		<template x-for="i in 10" :key="i">
			<input
					type="checkbox"
					:data-level="i"
					:checked="i <= element.value.value || i <= 1"
					@change="(event) => {element.value.value = (event.target.dataset.level - (event.target.checked ? 0 : 1))}"
			>
		</template>
	</div>
</div>
		`;
	}
}

class WillPower extends Type {
	constructor() {
		super('willpower')
	}

	getRawHtml() {
		return `
<div class="type type__willpower">
	<div class="willpower__name" x-text="element.name"></div>
	<div class="points_raw" x-data="">
		<template x-for="i in 10" :key="i">
			<input
					type="checkbox"
					:data-level="i"
					:checked="i <= element.value.current || i <= 0"
					@change="(event) => {element.value.current = (event.target.dataset.level - (event.target.checked ? 0 : 1))}"
			>
		</template>
	</div>
	<div class="points_raw" x-data="">
		<template x-for="i in 10" :key="i">
			<input
					type="checkbox"
					:data-level="i"
					:checked="i <= element.value.permanent || i <= 1"
					@change="(event) => {element.value.permanent = (event.target.dataset.level - (event.target.checked ? 0 : 1))}"
			>
		</template>
	</div>
</div>
		`
	}
}

class Blood extends Type {
	constructor() {
		super('blood');
	}

	getRawHtml() {
		return `
<div class="type type__blood">
	<div class="name blood__name" x-text="element.name"></div>
	<div class="points_raw" x-data="">
		<template x-for="i in 10" :key="i">
			<input
					type="checkbox"
					:data-level="i"
					:checked="i <= element.value || i <= 0"
					@change="(event) => {element.value = (event.target.dataset.level - (event.target.checked ? 0 : 1))}"
			>
		</template>
	</div>
	<div class="points_raw" x-data="">
		<template x-for="i in 10" :key="i">
			<input
					type="checkbox"
					:data-level="i+10"
					:checked="i+10 <= element.value || i <= 0"
					@change="(event) => {element.value = (event.target.dataset.level - (event.target.checked ? 0 : 1))}"
			>
		</template>
	</div>
	<div class="points_raw" x-data="">
		<template x-for="i in 10" :key="i">
			<input
					type="checkbox"
					:data-level="i+20"
					:checked="i+20 <= element.value || i <= 0"
					@change="(event) => {element.value = (event.target.dataset.level - (event.target.checked ? 0 : 1))}"
			>
		</template>
	</div>
	<div class="points_raw" x-data="">
		<template x-for="i in 10" :key="i">
			<input
					type="checkbox"
					:data-level="i+30"
					:checked="i+30 <= element.value || i <= 0"
					@change="(event) => {element.value = (event.target.dataset.level - (event.target.checked ? 0 : 1))}"
			>
		</template>
	</div>
</div>
		`
	}
}

//endregion