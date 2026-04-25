package content

type Feature struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type MarketItem struct {
	Label string `json:"label"`
	Value string `json:"value"`
	Text  string `json:"text"`
}

type SWOTItem struct {
	Letter string `json:"letter"`
	Title  string `json:"title"`
	Text   string `json:"text"`
}

type RevenueItem struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}

type TeamMember struct {
	Role string `json:"role"`
	Text string `json:"text"`
}

type AccountSummary struct {
	Name        string          `json:"name"`
	Status      string          `json:"status"`
	Plan        string          `json:"plan"`
	NextPayment string          `json:"nextPayment"`
	Stats       []MarketItem    `json:"stats"`
	Documents   []AccountRecord `json:"documents"`
	Questions   []AccountRecord `json:"questions"`
	Actions     []Feature       `json:"actions"`
}

type AccountRecord struct {
	Title string `json:"title"`
	Meta  string `json:"meta"`
}

type SubscriptionPlan struct {
	Name        string   `json:"name"`
	Price       string   `json:"price"`
	Description string   `json:"description"`
	Featured    bool     `json:"featured"`
	Sections    []string `json:"sections"`
}

type SiteContent struct {
	Features      []Feature          `json:"features"`
	Tools         []Feature          `json:"tools"`
	Market        []MarketItem       `json:"market"`
	Audience      []Feature          `json:"audience"`
	SWOT          []SWOTItem         `json:"swot"`
	Revenue       []RevenueItem      `json:"revenue"`
	Team          []TeamMember       `json:"team"`
	Account       AccountSummary     `json:"account"`
	Subscriptions []SubscriptionPlan `json:"subscriptions"`
}

func Data() SiteContent {
	return SiteContent{
		Features: []Feature{
			{Title: "AI заң кеңесшісі", Description: "Жұмыстан шығару, айыппұл, келісімшарт, неке, алимент және тұтынушы құқығы бойынша түсінікті жауаптар."},
			{Title: "Құжаттар шаблоны", Description: "Келісімшарт, арыз, сенімхат және шағым үлгілері: аты-жөніңізді енгізіп, дайын файл алыңыз."},
			{Title: "Онлайн заңгер", Description: "Чат, аудио және видео арқылы заңгерден тікелей кеңес алу мүмкіндігі."},
			{Title: "Құқықтық білім", Description: "Заңдық терминдер, қысқаша түсіндірмелер және тест сұрақтары."},
			{Title: "Бизнеске көмек", Description: "ИП ашу, келісімшарт тексеру, бизнес құжаттар және кәсіпкерлерге заң кеңесі."},
		},
		Tools: []Feature{
			{Title: "Айыппұл тексеру", Description: "ЖСН немесе көлік нөмірін енгізіп, айыппұл бар-жоғын бірден біліңіз."},
			{Title: "Аноним шағым", Description: "Заң бұзушылық туралы дәлел жүктеп, аты-жөніңізді көрсетпей хабарлаңыз."},
			{Title: "Жаңалықтар", Description: "Жаңа заңдар, өзгерістер және күнделікті өмірге пайдалы құқықтық кеңестер."},
			{Title: "Жеке кабинет", Description: "Құжаттарды сақтау, сұрақтар тарихын көру және жазылымды басқару."},
		},
		Market: []MarketItem{
			{Label: "TAM", Value: "15+ млн", Text: "Қазақстандағы интернет қолданушылар"},
			{Label: "SAM", Value: "5-7 млн", Text: "Құқықтық көмек қажет адамдар"},
			{Label: "SOM", Value: "50 000 - 100 000", Text: "Алғашқы кезеңдегі мақсатты қолданушылар"},
		},
		Audience: []Feature{
			{Title: "Студенттер", Description: "Оңай әрі түсінікті құқықтық білім алу."},
			{Title: "Жұмыс істейтін азаматтар", Description: "Еңбек, жұмыс және келісім мәселелері бойынша кеңес."},
			{Title: "Шағын бизнес иелері", Description: "Келісімшарт, ИП және бизнес құжаттарымен жұмыс."},
			{Title: "Кез келген азамат", Description: "Өз құқықтарын білуге және қорғауға мүдделі адамдар."},
		},
		SWOT: []SWOTItem{
			{Letter: "S", Title: "Күшті жақтары", Text: "Инновациялық идея, жоғары сұраныс және ыңғайлы цифрлық формат."},
			{Letter: "W", Title: "Әлсіз жақтары", Text: "Бастапқы қаржы қажет, алғашқы қолданушыларды тарту керек."},
			{Letter: "O", Title: "Мүмкіндіктер", Text: "Бүкіл Қазақстан бойынша дамыту, бизнеске арнайы қызмет ұсыну."},
			{Letter: "T", Title: "Қауіптер", Text: "Болашақта бәсекелестердің нарыққа кіруі мүмкін."},
		},
		Revenue: []RevenueItem{
			{Title: "Ақылы заңгер консультациясы", Text: "Пайдаланушылар онлайн заңгермен чат, аудио немесе видео арқылы жеке кеңес алады."},
			{Title: "Премиум құжаттар және жазылым", Text: "Кеңейтілген шаблондар мен толық функционалдылық үшін ай сайынғы тариф."},
			{Title: "Бизнес тариф", Text: "Кәсіпкерлер мен ШОБ үшін арнайы пакет: 1 000 қолданушы x 2 000 тг = 2 000 000 тг айлық кіріс."},
		},
		Team: []TeamMember{
			{Role: "Жоба авторы", Text: "Жалпы басқару және стратегия"},
			{Role: "Заңгер", Text: "Заңдық мазмұн және кеңес"},
			{Role: "IT маман", Text: "Қосымша жасау және техникалық қолдау"},
			{Role: "Дизайнер", Text: "UI/UX дизайн және визуалдық шешімдер"},
		},
		Account: AccountSummary{
			Name:        "Айдана Қ.",
			Status:      "Тексерілген қолданушы",
			Plan:        "Premium",
			NextPayment: "15 мамыр 2026",
			Stats: []MarketItem{
				{Label: "Құжат", Value: "12", Text: "сақталған файл"},
				{Label: "Сұрақ", Value: "8", Text: "AI және заңгер тарихы"},
				{Label: "Кеңес", Value: "3", Text: "онлайн консультация"},
			},
			Documents: []AccountRecord{
				{Title: "Еңбек шарты", Meta: "PDF • 24 сәуір 2026"},
				{Title: "Тұтынушы шағымы", Meta: "DOCX • 21 сәуір 2026"},
				{Title: "Сенімхат үлгісі", Meta: "PDF • 18 сәуір 2026"},
			},
			Questions: []AccountRecord{
				{Title: "Жұмыстан босату кезінде қандай құқықтарым бар?", Meta: "AI жауап • бүгін"},
				{Title: "Айыппұлды қалай тексеремін?", Meta: "Жылдам кеңес • кеше"},
				{Title: "ИП ашу үшін қандай құжат керек?", Meta: "Заңгер чаты • 19 сәуір 2026"},
			},
			Actions: []Feature{
				{Title: "Жаңа құжат жасау", Description: "Шаблон таңдап, деректерді толтырыңыз."},
				{Title: "Заңгерге жазылу", Description: "Чат, аудио немесе видео кеңес уақытын таңдаңыз."},
				{Title: "Жазылымды басқару", Description: "Тариф, төлем және Premium мүмкіндіктерін бақылаңыз."},
			},
		},
		Subscriptions: []SubscriptionPlan{
			{
				Name:        "Basic",
				Price:       "0 тг",
				Description: "Құқықтық ақпаратпен танысуға және негізгі бөлімдерді көруге арналған.",
				Sections: []string{
					"Құқықтық білім",
					"Жаңалықтар",
					"AI заң кеңесшісі: шектеулі сұрақ",
					"Жеке кабинет: негізгі тарих",
				},
			},
			{
				Name:        "Premium",
				Price:       "2 000 тг / ай",
				Description: "Жеке қолданушыларға толық құқықтық қолдау және құжаттармен жұмыс.",
				Featured:    true,
				Sections: []string{
					"AI заң кеңесшісі: толық қолжетімділік",
					"Құжаттар шаблоны",
					"Айыппұл тексеру",
					"Аноним шағым",
					"Онлайн заңгерге жазылу",
					"Жеке кабинет және құжат сақтау",
				},
			},
			{
				Name:        "Business",
				Price:       "келісім бойынша",
				Description: "Кәсіпкерлер мен шағын бизнеске келісімшарт, ИП және команда құжаттары.",
				Sections: []string{
					"Бизнеске көмек",
					"Келісімшарт тексеру",
					"Премиум құжаттар",
					"Онлайн заңгер",
					"Командаға арналған кабинет",
					"Басым техникалық қолдау",
				},
			},
		},
	}
}
