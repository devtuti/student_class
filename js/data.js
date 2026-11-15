/* ============================================================
   data.js — SAYTIN BÜTÜN MƏZMUNU
   Yeni məlumat əlavə etmək üçün yalnız bu faylı redaktə et.
   Şəkil: media/photos/  |  Video: media/videos/
   kids:[...] → həmin şəkil/videoda olan uşaqların id-ləri
============================================================ */
window.CLASS_DATA = {
  site: {
    className: "1Б",
    school: "Школа №55",
    city: "Екатеринбург",
    year: "2026 / 2027",
    teacher: {
      name: "Светлана Владимировна",
      role: "Наш классный руководитель",
      quote: "«Каждый ребёнок — это целая вселенная. Моя задача — помочь ей раскрыться»",
      email: "1b.school55@yandex.ru",
      phone: "+7 (952) 738-18-05",
      photo: ""
    }
  },

  stats: [
    { icon: "🧒", value: 25, suffix: "", label: "первоклассников", tint: "i-sky" },
    { icon: "🏆", value: 8, suffix: "", label: "событий за год", tint: "i-red" },
    { icon: "🎨", value: 24, suffix: "", label: "поделок и рисунков", tint: "i-amber" },
    { icon: "📸", value: 15, suffix: "", label: "фото и видео", tint: "i-green" }
  ],

  kids: [
    { id: 1, name: "Артём", surname: "С.", bday: "01-14", hobby: "Конструкторы", dream: "Космонавт", avatar: "" },
    { id: 2, name: "Маша", surname: "П.", bday: "01-27", hobby: "Рисование", dream: "Художник", avatar: "" },
    { id: 3, name: "Саша", surname: "К.", bday: "02-08", hobby: "Футбол", dream: "Футболист", avatar: "" },
    { id: 4, name: "Даша", surname: "С.", bday: "02-19", hobby: "Танцы", dream: "Балерина", avatar: "" },
    { id: 5, name: "Коля", surname: "В.", bday: "03-03", hobby: "Динозавры", dream: "Палеонтолог", avatar: "" },
    { id: 6, name: "Аня", surname: "М.", bday: "03-22", hobby: "Книги", dream: "Писатель", avatar: "" },
    { id: 7, name: "Петя", surname: "И.", bday: "04-10", hobby: "Конструкторы", dream: "Инженер", avatar: "" },
    { id: 8, name: "Лиза", surname: "Т.", bday: "04-25", hobby: "Кошки", dream: "Ветеринар", avatar: "" },
    { id: 9, name: "Максим", surname: "Д.", bday: "05-16", hobby: "Космос", dream: "Астроном", avatar: "" },
    { id: 10, name: "Соня", surname: "Б.", bday: "05-30", hobby: "Музыка", dream: "Певица", avatar: "" },
    { id: 11, name: "Ваня", surname: "Р.", bday: "06-11", hobby: "Роботы", dream: "Программист", avatar: "" },
    { id: 12, name: "Алина", surname: "Г.", bday: "06-24", hobby: "Плавание", dream: "Чемпионка", avatar: "" },
    { id: 13, name: "Тимофей", surname: "Н.", bday: "07-07", hobby: "Шахматы", dream: "Гроссмейстер", avatar: "" },
    { id: 14, name: "Полина", surname: "Ж.", bday: "07-19", hobby: "Цветы", dream: "Флорист", avatar: "" },
    { id: 15, name: "Миша", surname: "Ф.", bday: "08-02", hobby: "Машинки", dream: "Гонщик", avatar: "" },
    { id: 16, name: "Катя", surname: "Л.", bday: "08-21", hobby: "Пазлы", dream: "Архитектор", avatar: "" },
    { id: 17, name: "Егор", surname: "Ш.", bday: "09-09", hobby: "Фокусы", dream: "Фокусник", avatar: "" },
    { id: 18, name: "Вика", surname: "О.", bday: "09-28", hobby: "Лепка", dream: "Скульптор", avatar: "" },
    { id: 19, name: "Рома", surname: "Ц.", bday: "10-06", hobby: "Драконы", dream: "Писатель-фантаст", avatar: "" },
    { id: 20, name: "Настя", surname: "Ю.", bday: "10-17", hobby: "Гимнастика", dream: "Гимнастка", avatar: "" },
    { id: 21, name: "Дима", surname: "Х.", bday: "11-21", hobby: "Математика", dream: "Учёный", avatar: "" },
    { id: 22, name: "Оля", surname: "Э.", bday: "11-30", hobby: "Пение", dream: "Учительница", avatar: "" },
    { id: 23, name: "Кирилл", surname: "А.", bday: "12-05", hobby: "Хоккей", dream: "Хоккеист", avatar: "" },
    { id: 24, name: "Юля", surname: "Ч.", bday: "12-18", hobby: "Театр", dream: "Актриса", avatar: "" },
    { id: 25, name: "Лёва", surname: "Я.", bday: "12-29", hobby: "Животные", dream: "Зоолог", avatar: "" }
  ],

  categories: {
    lessons: "📖 На уроках",
    break: "⚽ Перемены",
    excursions: "🎒 Экскурсии",
    holidays: "🎉 Праздники"
  },

  photos: [
    { id: 1, title: "Первый звонок", date: "1 сентября", sort: "2026-09-01", cat: "holidays", src: "", scene: "party", seed: 11, kids: [1,2,3,4,5], likes: 14 },
    { id: 2, title: "Урок чтения", date: "2 сентября", sort: "2026-09-02", cat: "lessons", src: "", scene: "reading", seed: 12, kids: [6,7,8], likes: 9 },
    { id: 3, title: "Пишем первые буквы", date: "18 сентября", sort: "2026-09-18", cat: "lessons", src: "", scene: "classroom", seed: 13, kids: [9,10,11], likes: 11 },
    { id: 4, title: "Весёлая перемена", date: "20 сентября", sort: "2026-09-20", cat: "break", src: "", scene: "playground", seed: 14, kids: [12,13,14], likes: 16 },
    { id: 5, title: "Осенний парк", date: "8 октября", sort: "2026-10-08", cat: "excursions", src: "", scene: "park", seed: 15, kids: [15,16,17], likes: 12 },
    { id: 6, title: "Урок ИЗО: осень", date: "12 октября", sort: "2026-10-12", cat: "lessons", src: "", scene: "art", seed: 16, kids: [18,19,20], likes: 8 },
    { id: 7, title: "В библиотеке", date: "15 октября", sort: "2026-10-15", cat: "excursions", src: "", scene: "reading", seed: 17, kids: [21,22,23], likes: 7 },
    { id: 8, title: "Осенний бал", date: "25 октября", sort: "2026-10-25", cat: "holidays", src: "", scene: "party", seed: 18, kids: [24,25,1,2], likes: 19 },
    { id: 9, title: "Экскурсия в музей", date: "28 октября", sort: "2026-10-28", cat: "excursions", src: "", scene: "museum", seed: 19, kids: [3,4,5,6], likes: 13 },
    { id: 10, title: "День учителя", date: "5 ноября", sort: "2026-11-05", cat: "holidays", src: "", scene: "art", seed: 20, kids: [7,8,9], likes: 15 },
    { id: 11, title: "Игры во дворе", date: "7 ноября", sort: "2026-11-07", cat: "break", src: "", scene: "playground", seed: 21, kids: [10,11,12], likes: 10 },
    { id: 12, title: "Урок математики", date: "11 ноября", sort: "2026-11-11", cat: "lessons", src: "", scene: "classroom", seed: 22, kids: [13,14,15], likes: 6 }
  ],

  videos: [
    { id: 301, title: "Первый звонок — 1 сентября", date: "1 сентября", sort: "2026-09-01", cat: "holidays", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", poster: "", scene: "party", seed: 51, duration: "0:15", desc: "Демо-видео. Замените ссылку на свой файл: media/videos/first-call.mp4", kids: [1,2,3,4,5,6], likes: 11 },
    { id: 302, title: "Осенний бал — выступление", date: "25 октября", sort: "2026-10-25", cat: "holidays", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", poster: "", scene: "art", seed: 52, duration: "0:15", desc: "Демо-видео. Замените ссылку на свой файл: media/videos/autumn-ball.mp4", kids: [7,8,9,10,11], likes: 8 },
    { id: 303, title: "Весёлые старты", date: "12 ноября", sort: "2026-11-12", cat: "break", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", poster: "", scene: "sport", seed: 53, duration: "1:00", desc: "Демо-видео. Замените ссылку на свой файл: media/videos/sport.mp4", kids: [12,13,14,15,16], likes: 13 }
  ],

  crafts: [
    { id: 101, title: "Осенний букет", author: "Маша П.", kidId: 2, materials: "Листья, цветная бумага", date: "октябрь", src: "", art: "leaf", seed: 31, likes: 12 },
    { id: 102, title: "Домик моей мечты", author: "Петя И.", kidId: 7, materials: "Картон, клей", date: "сентябрь", src: "", art: "house", seed: 32, likes: 9 },
    { id: 103, title: "Цветок для мамы", author: "Даша С.", kidId: 4, materials: "Пластилин", date: "октябрь", src: "", art: "flower", seed: 33, likes: 15 },
    { id: 104, title: "Маска лисы", author: "Егор Ш.", kidId: 17, materials: "Картон, краски", date: "октябрь", src: "", art: "mask", seed: 34, likes: 7 },
    { id: 105, title: "Гоночная машина", author: "Миша Ф.", kidId: 15, materials: "Коробка, гуашь", date: "ноябрь", src: "", art: "car", seed: 35, likes: 11 },
    { id: 106, title: "Ракета к звёздам", author: "Максим Д.", kidId: 9, materials: "Втулка, фольга", date: "ноябрь", src: "", art: "rocket", seed: 36, likes: 18 },
    { id: 107, title: "Бабочка-красавица", author: "Полина Ж.", kidId: 14, materials: "Акварель, симметрия", date: "сентябрь", src: "", art: "butterfly", seed: 37, likes: 8 },
    { id: 108, title: "Первая снежинка", author: "Настя Ю.", kidId: 20, materials: "Бумага, ножницы", date: "ноябрь", src: "", art: "snowflake", seed: 38, likes: 10 }
  ],

  events: [
    { id: 201, date: "1 сентября 2026", title: "День знаний", icon: "🎉", desc: "Торжественная линейка, первый звонок и знакомство с классом. Наш школьный путь начался!", tags: ["Праздник","1Б"], src: "", scene: "party", seed: 41 },
    { id: 202, date: "15 сентября 2026", title: "Посвящение в первоклассники", icon: "🎒", desc: "Клятва первоклассника, весёлые испытания и первые медали. Теперь мы — настоящие ученики!", tags: ["Важное"], src: "", scene: "classroom", seed: 42 },
    { id: 203, date: "5 октября 2026", title: "День учителя", icon: "💐", desc: "Поздравили Елену Владимировну: открытки, стихи и дружное «Спасибо!»", tags: ["Праздник"], src: "", scene: "art", seed: 43 },
    { id: 204, date: "15 октября 2026", title: "Экскурсия в библиотеку", icon: "📚", desc: "Познакомились с абонементом, участвовали в викторине и выбрали первые книги для чтения.", tags: ["Экскурсия"], src: "", scene: "reading", seed: 44 },
    { id: 205, date: "25 октября 2026", title: "Осенний бал", icon: "🍂", desc: "Конкурсы, танцы и чаепитие с родителями. Спасибо родительскому комитету за праздник!", tags: ["Праздник","Родители"], src: "", scene: "party", seed: 45 },
    { id: 206, date: "5 ноября 2026", title: "Конкурс рисунков «Осень золотая»", icon: "🎨", desc: "Три призовых места! Работы Маши, Полины и Максима отправлены на городской этап.", tags: ["Конкурс","Победы"], src: "", scene: "art", seed: 46 },
    { id: 207, date: "12 ноября 2026", title: "Весёлые старты", icon: "🏃", desc: "Эстафеты, командный дух и первое место в параллели. Болеем за наших!", tags: ["Спорт","Победы"], src: "", scene: "sport", seed: 47 },
    { id: 208, date: "26 декабря 2026", title: "Новогодний утренник", icon: "🎄", desc: "Готовим стихи, песню и сюрприз для родителей. Ждём Деда Мороза!", tags: ["Скоро"], src: "", scene: "party", seed: 48, upcoming: true }
  ],

  achievements: [
    { kidId: 11, title: "Самый добрый помощник", icon: "🤝", month: "ноябрь" },
    { kidId: 2, title: "Юный художник месяца", icon: "🎨", month: "ноябрь" },
    { kidId: 6, title: "Чемпион по чтению", icon: "📖", month: "ноябрь" },
    { kidId: 21, title: "Открытие месяца", icon: "⭐", month: "ноябрь" }
  ],

  quotes: [
    { text: "«Школа — это место, где перемена пока длиннее урока. Но я работаю над этим!»", author: "Егор Ш." },
    { text: "«Я научилась писать букву Б. Она похожа на бегемотика с животиком!»", author: "Аня М." },
    { text: "«Мы с Димой теперь лучшие друзья. Он поделился печеньем — это навсегда.»", author: "Артём С." },
    { text: "«Листья падают, потому что им холодно на дереве. Я их осенью жалею.»", author: "Соня Б." },
    { text: "«Когда я вырасту, стану учителем. Но задавать домашку не буду — я добрый.»", author: "Миша Ф." }
  ],

  schedule: {
    times: ["8:30–9:10","9:25–10:05","10:20–11:00","11:15–11:55"],
    days: [
      { short: "Пн", lessons: ["Математика","Русский язык","Литературное чтение","Физкультура"] },
      { short: "Вт", lessons: ["Русский язык","Математика","Окружающий мир","ИЗО"] },
      { short: "Ср", lessons: ["Литературное чтение","Математика","Русский язык","Музыка"] },
      { short: "Чт", lessons: ["Математика","Русский язык","Литературное чтение","Технология"] },
      { short: "Пт", lessons: ["Русский язык","Окружающий мир","Физкультура","Классный час"] }
    ]
  },

  subjects: {
    "Математика": "🔢", "Русский язык": "✏️", "Литературное чтение": "📖",
    "Окружающий мир": "🌍", "Физкультура": "⚽", "ИЗО": "🎨",
    "Музыка": "🎵", "Технология": "✂️", "Классный час": "💬"
  },

  contacts: [
    { icon: "👩‍🏫", name: "Светлана Владимировна", role: "Классный руководитель", phone: "+7 (952) 738-18-05", email: "1b.school55@yandex.ru", addr: "" },
    { icon: "👪", name: "Родительский комитет", role: "Праздники, фото и вопросы", phone: "+7 (922) 100-55-55", email: "1b.parents@yandex.ru", addr: "" },
    { icon: "🏫", name: "Школа №55", role: "г. Екатеринбург", phone: "+7 (343) 200-55-00", email: "", addr: "Приёмная: пн–пт, 8:00–17:00" }
  ],

  links: [
    { icon: "📖", title: "Российская электронная школа", desc: "Уроки по всем предметам", url: "https://resh.edu.ru" },
    { icon: "🧠", title: "Учи.ру", desc: "Интерактивные задания", url: "https://uchi.ru" },
    { icon: "📚", title: "Яндекс Учебник", desc: "Тренажёры для начальной школы", url: "https://education.yandex.ru" }
  ],

  notes: [
    { title: "🎒 Что нужно в школу", items: ["Сменная обувь","Форма для физкультуры","Пенал: ручки, карандаши, линейка","Вода и лёгкий перекус","Хорошее настроение — обязательно!"] },
    { title: "⏰ Режим дня первоклассника", items: ["7:00 — подъём и зарядка","8:30–12:00 — уроки","После школы — обед и отдых минимум час","Прогулка на свежем воздухе каждый день","21:00 — сон. Первокласснику нужно 10 часов сна!"] },
    { title: "📏 Правила нашего класса", items: ["Приходим за 10 минут до звонка","Слушаем друг друга и не перебиваем","Помогаем, если кто-то затрудняется","Бережём школьные вещи и вещи друзей","Не боимся ошибаться — ошибки помогают учиться!"] },
    { title: "⬇️ Как скачать фото и видео", items: ["Откройте нужное фото или видео на сайте.","Нажмите кнопку «Скачать».","Android: файл сохранится в папку «Загрузки».","iPhone / iPad: если файл открылся в новой вкладке — «Поделиться» → «Сохранить в Файлы».","Компьютер: файл сохранится в стандартную папку загрузок браузера.","В карточке ребёнка можно скачать все его фото одним ZIP-архивом."] },
    { title: "❤️ Как работают лайки", items: ["Лайки хранятся только в вашем браузере (localStorage).","Это личная отметка «мне нравится», а не общий счётчик для всех.","Настоящий общий счётчик требует базы данных (Firebase, Supabase или Laravel API)."] }
  ]
};