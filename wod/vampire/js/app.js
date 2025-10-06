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
				},
				skills: {
					name: 'Способности',
					groups: {
						talents: {
							name: 'Таланты',
							data: this.getGroupInitData('skills'),
							elements: {
								athletics: this.getAttribute('skills', 'athletics', 'Атлетика'),
								attention: this.getAttribute('skills', 'attention', 'Внимательность'),
								intimidation: this.getAttribute('skills', 'intimidation', 'Запугивание'),
								streetwise: this.getAttribute('skills', 'streetwise', 'Знание Улиц'),
								leadership: this.getAttribute('skills', 'leadership', 'Лидерство'),
								melee: this.getAttribute('skills', 'melee', 'Рукопашный Бой'),
								evasion: this.getAttribute('skills', 'evasion', 'Уклонение'),
								cunning: this.getAttribute('skills', 'cunning', 'Хитрость'),
								expression: this.getAttribute('skills', 'expression', 'Экспрессия'),
								empathy: this.getAttribute('skills', 'empathy', 'Эмпатия'),
							}
						},
						capabilities: {
							name: 'Навыки',
							data: this.getGroupInitData('skills'),
							elements: {
								security: this.getAttribute('skills', 'security', 'Безопасность'),
								driving: this.getAttribute('skills', 'driving', 'Вождение'),
								survival: this.getAttribute('skills', 'survival', 'Выживание'),
								execution: this.getAttribute('skills', 'execution', 'Исполнение'),
								knowledge_animals: this.getAttribute('skills', 'knowledge_animals', 'Знание Животных'),
								crafts: this.getAttribute('skills', 'crafts', 'Ремесла'),
								stealth: this.getAttribute('skills', 'stealth', 'Скрытность'),
								shooting: this.getAttribute('skills', 'shooting', 'Стрельба'),
								fencing: this.getAttribute('skills', 'fencing', 'Фехтование'),
								etiquette: this.getAttribute('skills', 'etiquette', 'Этикет'),
							}
						},
						knowledge: {
							name: 'Познания',
							data: this.getGroupInitData('skills'),
							elements: {
								academics: this.getAttribute('skills', 'academics', 'Академические'),
								laws: this.getAttribute('skills', 'laws', 'Законы'),
								computers: this.getAttribute('skills', 'computers', 'Компьютеры'),
								linguistics: this.getAttribute('skills', 'linguistics', 'Лингвистика'),
								medicine: this.getAttribute('skills', 'medicine', 'Медицина'),
								sciences: this.getAttribute('skills', 'sciences', 'Научные'),
								occult: this.getAttribute('skills', 'occult', 'Оккультизм'),
								politics: this.getAttribute('skills', 'politics', 'Политикa'),
								investigations: this.getAttribute('skills', 'investigations', 'Расследования'),
								finance: this.getAttribute('skills', 'finance', 'Финансы'),
							}
						}
					}
				},
				advantages: {
					name: 'Преимущества',
					groups: {
						additions: {
							name: 'Дополнения',
							data: this.getGroupInitData('advantages'),
							elements: {
								allies: this.getAttribute('advantages', 'allies', 'Союзники'),
								contacts: this.getAttribute('advantages', 'contacts', 'Связи'),
								fame: this.getAttribute('advantages', 'fame', 'Слава'),
								herd: this.getAttribute('advantages', 'herd', 'Стадо'),
								influence: this.getAttribute('advantages', 'influence', 'Влияние'),
								resources: this.getAttribute('advantages', 'resources', 'Ресурсы'),
								retainers: this.getAttribute('advantages', 'retainers', 'Последователи'),
								haven: this.getAttribute('advantages', 'haven', 'Убежище'),
								mask: this.getAttribute('advantages', 'mask', 'Маска'),
								status: this.getAttribute('advantages', 'status', 'Статус')
							}
						},
						disciplines: {
							name: 'Дисциплины',
							data: this.getGroupInitData('disciplines'),
							elements: {
								animalism: this.getDiscipline(
									'animalism',
									'Анимализм',
									['gangrel', 'brujah', 'nosferatu'],
									[],
									[],
									'Дисциплина, управляющая животными и связанная с природными инстинктами.',
									false
								),
								auspex: this.getDiscipline(
									'auspex',
									'Ауспекс',
									['toreador', 'brujah', 'ravnos'],
									[],
									[],
									'Прорицание, расширение восприятия: ясновидение, астральные чувства, чтение аур и мыслей.',
									false
								),
								celerity: this.getDiscipline(
									'celerity',
									'Стремительность',
									['brujah', 'gangrel', 'lasombra'],
									[],
									[],
									'Сверхъестественная скорость — ускорение движений и реакции.',
									false
								),
								dominate: this.getDiscipline(
									'dominate',
									'Доминирование',
									['ventrue', 'tremere', 'lasombra'],
									[],
									[],
									'Манипуляция разумом: приказы, обязательства, контроль и внушение.',
									false
								),
								fortitude: this.getDiscipline(
									'fortitude',
									'Стойкость',
									['toreador', 'gangrel', 'ventrue'],
									[],
									[],
									'Устойчивость к урону, выживаемость и стойкость против сверхъестественных эффектов.',
									false
								),
								obfuscate: this.getDiscipline(
									'obfuscate',
									'Сокрытие',
									['nosferatu', 'malkavian', 'tremere'],
									[],
									[],
									'Скрытие присутствия: маскировка, иллюзии, умение оставаться незаметным.',
									false
								),
								potence: this.getDiscipline(
									'potence',
									'Могущество',
									['brujah', 'gangrel', 'followers'],
									[],
									[],
									'Физическая сила сверхчеловеческого уровня — усиление ударов, возможности ломать преграды.',
									false
								),
								presence: this.getDiscipline(
									'presence',
									'Присутствие',
									['toreador', 'ventrue', 'nosferatu'],
									[],
									[],
									'Влияние на эмоции и волю — очарование, вдохновение, страх.',
									false
								),
								protean: this.getDiscipline(
									'protean',
									'Превращение',
									['gangrel', 'brujah', 'lasombra'],
									['shapechange', 'claws', 'blooddrain'],
									[],
									'Дисциплина, позволяющая изменять форму: превращения, животные формы, когти.',
									false
								),
								thaumaturgy: this.getDiscipline(
									'thaumaturgy',
									'Тауматургия',
									['tremere'],
									['alchemy', 'biothaumaturgy', 'movement_of_the_mind', 'green_path', 'oneiromancy'],
									[],
									'Кровная магия Тремеров — протауматургическая система с множеством путей.',
									true
								),
								necromancy: this.getDiscipline(
									'necromancy',
									'Некромантия',
									['giovanni', 'tremere'],
									['cenotaph', 'bone', 'mortuus', 'ash', 'sepulchre', 'vitreous'],
									[],
									'Магия смерти: манипуляция душами, мёртвыми, путями смерти.',
									true
								),
								obtenebration: this.getDiscipline(
									'obtenebration',
									'Обтенебрация',
									['lasombra'],
									[],
									[],
									'Дисциплина Теней — управление тьмой и тенями, создание плотных теневых форм.',
									false
								),
								vicissitude: this.getDiscipline(
									'vicissitude',
									'Изменчивость',
									['giovanni'],
									[],
									[],
									'Изменение плоти и костей — дисциплина, дающая возможность модифицировать тело.',
									false
								),
								dementation: this.getDiscipline(
									'dementation',
									'Помешательство',
									['malkavian'],
									[],
									[],
									'Искажение сознания, провокация безумия, создание иллюзий и фобий.',
									false
								),
								melpominee: this.getDiscipline(
									'melpominee',
									'Мельпомения',
									[],
									[],
									[],
									'Дисциплина, связанная с музыкой, голосом и чарующим эффектом искусства.',
									false
								),
								koldunic_sorcery: this.getDiscipline(
									'koldunic_sorcery',
									'Колдовство',
									['ravnos'],
									['way_of_wind', 'way_of_water', 'way_of_spirit', 'way_of_earth', 'way_of_fire', 'way_of_sorrow'],
									[],
									'Колдовство кельтско-горных традиций; содержит «пути» (ветры, воды, духа, земли, огня и скорби).',
									true
								),
								assamite_sorcery: this.getDiscipline(
									'assamite_sorcery',
									'Чародейство Ассамитов',
									['assamite'],
									['hunters_winds', 'awakening_of_the_steel', 'whispers_of_the_heavens'],
									[],
									'Ассамитская традиция магии — набор путей и техник, основанных на боевых и мистических практиках.',
									true
								),
								setite_sorcery: this.getDiscipline(
									'setite_sorcery',
									'Чародейство Сеттитов',
									['setite'],
									['hand_of_god', 'union_with_set', 'serpent_temptation', 'dried_nile_path', 'duat_path', 'ushebti'],
									[],
									'Сетитовская магия, связанная с культом Сета; содержит несколько путей/школ.',
									true
								),
								spiritus: this.getDiscipline(
									'spiritus',
									'Шаманство',
									[],
									[],
									[],
									'Дисциплина, связанная с духами и шаманскими практиками; взаимодействие с духами, призыв и контроль.',
									false
								)

								/**
								animalism: this.getAttribute('disciplines', 'animalism', 'Анимализм'),
								auspex: this.getAttribute('disciplines', 'auspex', 'Ауспекс'),
								celerity: this.getAttribute('disciplines', 'celerity', 'Стремительность'),
								dominate: this.getAttribute('disciplines', 'dominate', 'Доминирование'),
								fortitude: this.getAttribute('disciplines', 'fortitude', 'Стойкость'),
								obfuscate: this.getAttribute('disciplines', 'obfuscate', 'Сокрытие'),
								necromancy: this.getAttribute('disciplines', 'necromancy', 'Некромантия'),
								potence: this.getAttribute('disciplines', 'potence', 'Могущество'),
								presence: this.getAttribute('disciplines', 'presence', 'Присутствие'),
								protean: this.getAttribute('disciplines', 'protean', 'Протея'),
								thaumaturgy: this.getAttribute('disciplines', 'thaumaturgy', 'Тауматургия'),
								chimerstry: this.getAttribute('disciplines', 'chimerstry', 'Химерия'),
								dementation: this.getAttribute('disciplines', 'dementation', 'Помешательство'),
								obtenebration: this.getAttribute('disciplines', 'obtenebration', 'Обтенебрация'),
								quietus: this.getAttribute('disciplines', 'quietus', 'Квиетус'),
								serpentis: this.getAttribute('disciplines', 'serpentis', 'Серпентис'),
								temporis: this.getAttribute('disciplines', 'temporis', 'Темпорис'),
								visceratika: this.getAttribute('disciplines', 'visceratika', 'Висцератика'),
								melpominee: this.getAttribute('disciplines', 'melpominee', 'Мельпоминея'),
								mytherceria: this.getAttribute('disciplines', 'mytherceria', 'Митерсерия'),
								valeren: this.getAttribute('disciplines', 'valeren', 'Валерен'),
								obeah: this.getAttribute('disciplines', 'obeah', 'Обея')
								 **/
							}
						},
						virtues: {
							name: 'Добродетели',
							data: this.getGroupInitData('advantages'),
							elements: {
								consciousness: this.getAttribute('advantages', 'consciousness', 'Сознательность'),
								conviction: this.getAttribute('advantages', 'conviction', 'Убеждённость'),
								self_control: this.getAttribute('advantages', 'self_control', 'Самоконтроль'),
								instincts: this.getAttribute('advantages', 'instincts', 'Инстинкты'),
								courage: this.getAttribute('advantages', 'courage', 'Смелость'),
							}
						}
					}
				},
				other: {
					groups: {
						aspects: {
							name: 'Преимущества и недостатки',
							elements: this.getAspectInitLis()
						},
						humanity_willpower_blood: {
							elements: {
								humanity: {
									name: 'Человечность / Путь',
									value: 'humanity',
									type: this.getType('text')
								},
								willpower: {
									name: 'Сила Воли',
									value: {
										permanent: 7,
										current: 6
									},
									type: this.getType('number')
								},
								blood: {
									name: 'Запас крови',
									value: {
										current: 5
									},
									type: this.getType('number')
								}
							}
						},
						health: {
							name: 'Здоровье',
							data: {
								damage_type: {
									none: {
										name: 'Цел'
									},
									bashing: {
										name: 'Ударные'
									},
									lethal: {
										name: 'Летальные'
									},
									aggravated: {
										name: 'Непоглощаемые (аграва)'
									}
								},
							},
							elements: this.initHealthTrack()
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
		if (section !== 'attributes' || section !== 'skills') {
			return {
				isNeed: false
			}
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
		if (!!this.getGroupData(sectionKey, groupKey).isNeed) {
			this.getGroupData(sectionKey, groupKey).points.current += diff
		}
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

	getDiscipline(
		code,           // string: уникальный идентификатор дисциплины
		name,           // string: локализованное название
		clans = [],     // array of strings: кланы, для которых дисциплина клановая
		paths = [],     // array of strings: пути / ветви дисциплины
		variants = [],  // array of strings: альтернативные версии / специализации
		description = '', // string: описание дисциплины
		ritualSupport = false // boolean: поддержка ритуалов
	) {
		// преобразуем пути и варианты в нужную структуру
		const pathsObj = {};
		paths.forEach(p => {
			pathsObj[p] = {name: p, value: {permanent: 0, temporary: 0}}
		});

		const variantsObj = variants.map(v => ({name: v, value: {permanent: 0, temporary: 0}}));

		return {
			code: code,
			name: name,
			value: {permanent: 0, temporary: 0},
			type: this.getType('points'),
			clans: clans,
			paths: pathsObj,
			variants: variantsObj,
			metadata: {
				isClanDiscipline: clans.length > 0,
				source: 'wod.su',
				description: description,
				ritualSupport: ritualSupport
			}
		};
	}

	getAspectInitLis() {
		let list = {}
		for (let i = 0; i < 6; i++) {
			list['empty_aspect_' + i] = {
				name: '',
				value: {
					effect: 0,
					is_good: false
				},
				type: this.getType('text')
			}
		}
		return list
	}




	initHealthTrack() {
		const list = {}

		list['bruised'] = this.createHealthPoint('bruised', 'Задет', 0)
		list['hurt'] = this.createHealthPoint('hurt', 'Повреждён', -1)
		list['injured'] = this.createHealthPoint('injured', 'Ранен', -1)
		list['wounded'] = this.createHealthPoint('wounded', 'Тяжело ранен', -2)
		list['mauled'] = this.createHealthPoint('mauled', 'Травмирован', -2)
		list['crippled'] = this.createHealthPoint('crippled', 'Искалечен', -5)
		list['incapacitated'] = this.createHealthPoint('incapacitated', 'Обездвижен', -99)
		list['torpor'] = this.createHealthPoint('torpor', 'Торпор', -999)

		list['weakness'] = {
			name: 'Слабость',
			value: '',
			type: this.getType('weakness')
		}

		return list
	}


	createHealthPoint(id, name, fine = 0, damage_type = 'none') {
		return {
			name: name,
			value: {
				damage_type
			},
			fine: fine,
			type: this.getType('health_point')
		}
	}

	getHeadInitElement(code, name) {
		const isGeneration = code === 'generation'
		const isClan = code === 'clan'
		const typeCode = isGeneration ? 'number' : (isClan ? 'clan' : 'text')
		const value = isGeneration ? 13 : (isClan ? 'none' : '')
		return {
			name: name,
			value: value,
			type: this.getType(typeCode),
		}
	}

	getType(type = 'number') {
		if (type === 'health_point') {
			type = "number"
		}
		if (type === 'weakness') {
			type = "text"
		}
		if (type === 'clan') {
			return  {
				typeCode: type
			}
		}
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

class Points {
	static getRawHtml() {
		return `
			<span x-text="element.name"></span>
			<span>: </span>
			<div class="points" style="display: inline-block">
				<template x-for="i in element.maxLevel" :key="i">
					<input
							type="checkbox"
							:data-level="i+1"
							:checked="i+1 <= element.value.permanent"
							@change="(event) => {element.value.permanent = event.target.dataset.level}"
					>
				</template>
			</div>
			`;
	}
}