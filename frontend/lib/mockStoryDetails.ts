export type AuthorLinkPlatform = "twitter" | "instagram" | "vk" | "telegram" | "website" | "youtube";

export type AuthorLink = {
  platform: AuthorLinkPlatform;
  url: string;
};

export type Chapter = {
  id: number;
  number: number;
  title: string;
};

export type StoryComment = {
  id: number;
  user: string;
  text: string;
  date: string;
};

export type StoryExtra = {
  authorNote: string;
  authorLinks: AuthorLink[];
  comments: StoryComment[];
  likes: number;
  dislikes: number;
  chapters?: string[];
};

const EXTRAS: Record<number, StoryExtra> = {
  1: {
    authorNote:
      "Эта история родилась из детских воспоминаний о прогулках в лесу. Хочу поблагодарить всех читателей за поддержку — вы мои крылья!",
    authorLinks: [
      { platform: "vk", url: "https://vk.com/artem_belov_writer" },
      { platform: "telegram", url: "https://t.me/artem_writes" },
    ],
    likes: 1243,
    dislikes: 47,
    comments: [
      { id: 1, user: "КнижныйЧервь", text: "Потрясающее начало! Не могу оторваться от чтения.", date: "2024-03-15" },
      { id: 2, user: "Алиса_99", text: "Главный герой очень живой, верю каждому его шагу.", date: "2024-04-02" },
      { id: 3, user: "Dark_Reader", text: "Атмосфера леса передана великолепно. Жду продолжения!", date: "2024-04-20" },
    ],
    chapters: [
      "Пролог: Запретный лес",
      "Находка",
      "Проклятие пробудилось",
      "Голоса в темноте",
      "Древний договор",
      "Первая кровь",
      "Следы прошлого",
      "Встреча с Хранителем",
      "Цена силы",
      "Западня",
      "Лесные духи",
      "Потерянная деревня",
      "Ключ к артефакту",
      "Предательство",
      "Сердце тьмы",
      "Последний ритуал",
      "Рассвет",
      "Эпилог: Новый страж",
    ],
  },
  2: {
    authorNote:
      "Вдохновилась реальными снами. Этот роман писался в 3 часа ночи — и атмосфера в нём именно такая.",
    authorLinks: [
      { platform: "instagram", url: "https://instagram.com/maria_sokolova_books" },
      { platform: "website", url: "https://mariasokolova.ru" },
    ],
    likes: 892,
    dislikes: 31,
    comments: [
      { id: 1, user: "ThrillSeeker", text: "Каждая глава — новая загадка. Обожаю такой детектив!", date: "2023-11-10" },
      { id: 2, user: "МечтательницаА", text: "Когда узнала, что город существует только во снах — мурашки по коже!", date: "2023-12-01" },
    ],
    chapters: [
      "Первое исчезновение",
      "Странные сны",
      "Досье",
      "Параллельный мир",
      "Сонная тропа",
      "Свидетель",
      "Архивы",
      "Второй пропавший",
      "Карта снов",
      "Ловушка",
      "Голос из прошлого",
      "Двойник",
      "Подземный город",
      "Тени",
      "Шифр",
      "Третья жертва",
      "Сговор",
      "Час волка",
      "Разрыв реальности",
      "Мост между мирами",
      "Сломанные часы",
      "Лабиринт",
      "Зеркало",
      "Источник снов",
      "Охотник становится добычей",
      "Архитектор",
      "Старая вина",
      "Прорыв",
      "Пробуждение",
      "Суд снов",
      "Прощание с городом",
      "Возвращение",
      "Последний сон",
      "Эпилог: Пустой кабинет",
    ],
  },
  3: {
    authorNote:
      "Механический Рыцарь рождался из любви к Жюлю Верну и викторианской эстетике. Каждый винтик в романе — метафора человеческой воли.",
    authorLinks: [
      { platform: "vk", url: "https://vk.com/dmitry_orlov_author" },
      { platform: "telegram", url: "https://t.me/orlov_steampunk" },
    ],
    likes: 743,
    dislikes: 52,
    comments: [
      { id: 1, user: "SteamFan", text: "Лучший стимпанк на русском! Атмосфера на высоте.", date: "2024-05-10" },
      { id: 2, user: "Шестерёнка", text: "Голем получился таким живым, переживаю за него больше, чем за людей.", date: "2024-06-01" },
    ],
    chapters: [
      "Пролог: Мастерская",
      "Первый чертёж",
      "Пар и сталь",
      "Городской совет",
      "Неудача",
      "Новые детали",
      "Испытание",
      "Армия на горизонте",
      "Экстренный сбор",
      "Рождение голема",
      "Первый выход",
      "Рыночная площадь",
      "Механическое сердце",
      "Тайный заказ",
      "Завод оружия",
      "Шпион среди нас",
      "Засада",
      "Ремонт в ночи",
      "Союзники",
      "Предательство мастера",
      "Трещина в броне",
      "Контратака",
      "Уличные бои",
      "Секрет двигателя",
      "Подземный завод",
      "Горящий квартал",
      "Потеря",
      "Новый чертёж",
      "Дети войны",
      "Переговоры",
      "Засада в доках",
      "Паровой форт",
      "Ночная вылазка",
      "Мятеж в армии",
      "Загадочный генерал",
      "Сердце машины",
      "Прорыв обороны",
      "Жертва",
      "Без пара",
      "Последний заряд",
      "Рукопашный бой",
      "Горящие шестерёнки",
      "Решающий час",
      "Взрыв",
      "После битвы",
      "Руины города",
      "Новый порядок",
      "Воспоминания",
      "Голем отдыхает",
      "Последний чертёж",
      "Тишина над городом",
      "Эпилог: Новая эра",
    ],
  },
  4: {
    authorNote:
      "Алая Луна — история о том, что ненависть и любовь живут по соседству. Я писала её в горах, под настоящей полной луной.",
    authorLinks: [
      { platform: "instagram", url: "https://instagram.com/natalia_kim_author" },
      { platform: "telegram", url: "https://t.me/natalia_kim_books" },
    ],
    likes: 1105,
    dislikes: 38,
    comments: [
      { id: 1, user: "RomanceReader", text: "Их отношения прописаны так тонко — не сразу понимаешь, когда ненависть превратилась в любовь.", date: "2024-01-20" },
      { id: 2, user: "FantasyLover", text: "Магия луны в этой книге — отдельный персонаж!", date: "2024-02-08" },
    ],
    chapters: [
      "Кровавая луна",
      "Враги поневоле",
      "Скрытый лагерь",
      "Ночная стража",
      "Первая ссора",
      "Общая опасность",
      "Тайна её рода",
      "Раненый волк",
      "Доверие",
      "Запретное чувство",
      "Лунный обряд",
      "Клятва",
      "Ревность",
      "Испытание огнём",
      "Между двух миров",
      "Голос крови",
      "Предсказание",
      "Разлука",
      "Поиски",
      "Тёмный лес",
      "Снова вместе",
      "Цена выбора",
      "Последняя луна",
      "Битва кланов",
      "Исцеление",
      "Признание",
      "Мир",
      "Новое начало",
      "Эпилог: Под алой луной",
    ],
  },
  5: {
    authorNote:
      "Звёздный Странник — это мой ответ на вопрос: что, если мы одни во Вселенной? Писал его три года и горжусь каждой строчкой.",
    authorLinks: [
      { platform: "twitter", url: "https://twitter.com/igor_scifi" },
      { platform: "youtube", url: "https://youtube.com/@igor_zaicev_sf" },
    ],
    likes: 2371,
    dislikes: 28,
    comments: [
      { id: 1, user: "Cosmonauta", text: "Лучшая научная фантастика на русском языке за последние годы!", date: "2024-06-01" },
      { id: 2, user: "Орбита_9", text: "Рейтинг 4.9 заслужен полностью. Каждая глава — шедевр.", date: "2024-07-14" },
      { id: 3, user: "NightReads", text: "Читал залпом до 4 утра. Спасибо и проклинаю одновременно 😄", date: "2024-08-02" },
    ],
    chapters: [
      "Пролог: Последний сигнал",
      "Капитан без команды",
      "Неизвестные координаты",
      "Первый контакт",
      "Поверхность планеты",
      "Они наблюдают",
      "Ловушка или спасение",
      "Правда о планете",
      "Решение капитана",
      "Обратный путь",
      "Эпилог: Новые звёзды",
    ],
  },
  6: {
    authorNote:
      "Подземные катакомбы — это реальное место. Я побывала там и поняла: история под нами живёт своей жизнью.",
    authorLinks: [
      { platform: "vk", url: "https://vk.com/olga_fedorova_writer" },
    ],
    likes: 634,
    dislikes: 29,
    comments: [
      { id: 1, user: "HistoryBuff", text: "Прочитала за один вечер — оторваться невозможно!", date: "2022-03-15" },
      { id: 2, user: "Arkheolog", text: "Детали подземелья описаны очень достоверно.", date: "2022-05-02" },
    ],
    chapters: [
      "Запрещённый вход",
      "Первый уровень",
      "Исторические улики",
      "Преследователи",
      "Сердце катакомб",
      "Великое сокрытие",
      "Свет наверху",
    ],
  },
  7: {
    authorNote:
      "Принцесса и дракон — архетипы, которые я решил перевернуть. Здесь дракон — это не чудовище, а последний союзник.",
    authorLinks: [
      { platform: "vk", url: "https://vk.com/pavel_morozov_fantasy" },
      { platform: "telegram", url: "https://t.me/morozov_dragon" },
      { platform: "instagram", url: "https://instagram.com/pavel_morozov_books" },
    ],
    likes: 1987,
    dislikes: 44,
    comments: [
      { id: 1, user: "DragonFan", text: "61 глава — и ни одной лишней! Каждая сцена работает.", date: "2024-07-03" },
      { id: 2, user: "FantasyReader", text: "Плакала на 44-й главе. Сердце дракона — это буквально.", date: "2024-08-11" },
      { id: 3, user: "BookNerd", text: "Лучший фэнтезийный роман этого года, без вопросов.", date: "2024-09-01" },
    ],
    chapters: [
      "Проклятие с рождения",
      "Дорога на край света",
      "Первый дракон",
      "Отказ",
      "Тёмное предсказание",
      "Встреча с охотником",
      "Горный перевал",
      "Гнездо",
      "Голос дракона",
      "Первое доверие",
      "Яд проклятия",
      "Деревня на краю",
      "Легенда о последнем",
      "Испытание огнём",
      "Ночной разговор",
      "Следы других охотников",
      "Предательство спутника",
      "Раненый дракон",
      "Исцеление",
      "Тайный язык",
      "Луна над пропастью",
      "Ревность дракона",
      "Древний храм",
      "Книга проклятий",
      "Ключ",
      "Враги из прошлого",
      "Новый союзник",
      "Ледяные горы",
      "Буря",
      "Потерянная принцесса",
      "Послание отца",
      "Замок в облаках",
      "Стражи",
      "Слёзы дракона",
      "Золотые чешуйки",
      "Первый полёт",
      "Над морем",
      "Остров духов",
      "Испытание любовью",
      "Оракул",
      "Правда о проклятии",
      "Цена исцеления",
      "Выбор",
      "Сердце дракона",
      "Кровь и пламя",
      "Договор",
      "Возвращение принцессы",
      "Королевский двор",
      "Разоблачение",
      "Война",
      "Дракон в битве",
      "Финальная стражница",
      "Свет над замком",
      "Последнее проклятие",
      "Разрыв цепей",
      "Свободный дракон",
      "Принцесса и огонь",
      "Новый мир",
      "Покой",
      "Золотая корона",
      "Эпилог: Навсегда",
    ],
  },
  8: {
    authorNote:
      "Последний Самурай — это не про Японию. Это про любого человека, который отказывается предавать себя ради новых правил.",
    authorLinks: [
      { platform: "vk", url: "https://vk.com/anna_petrova_writer" },
      { platform: "instagram", url: "https://instagram.com/anna_petrova_books" },
    ],
    likes: 876,
    dislikes: 33,
    comments: [
      { id: 1, user: "HistoryFan", text: "Эпично и трагично одновременно. Анна Петрова — мастер!", date: "2022-11-05" },
      { id: 2, user: "Bushido", text: "Кодекс чести передан с великим уважением к традиции.", date: "2023-01-14" },
    ],
    chapters: [
      "Конец эпохи",
      "Клятва самурая",
      "Новый порядок",
      "Сопротивление",
      "Первая схватка",
      "Предатели",
      "Тайный монастырь",
      "Ученик",
      "Кодекс чести",
      "Засада",
      "Рана",
      "Голос предков",
      "Последний соратник",
      "Ночная дорога",
      "Столица",
      "Аудиенция",
      "Вызов",
      "Катана против ружья",
      "Разгром",
      "Один против тысячи",
      "Последний бой",
      "Память",
      "Эпилог: Честь бессмертна",
    ],
  },
  9: {
    authorNote:
      "Манас — бул жөн гана аңгеме эмес, бул биздин элдин жүрөгү. Бул долбоорго болгон колдоого ыраазымын!",
    authorLinks: [
      { platform: "instagram", url: "https://instagram.com/tilek_usupov_kg" },
      { platform: "youtube", url: "https://youtube.com/@tilek_kyrgyz" },
    ],
    likes: 2100,
    dislikes: 18,
    comments: [
      { id: 1, user: "KyrgyzReader", text: "Мындан сонун чыгарма жок! Эпосту жаңы сырт менен берет.", date: "2024-01-05" },
      { id: 2, user: "АлтынАйым", text: "Балдарыма деле окутам дейм. Руханий байлык!", date: "2024-02-14" },
      { id: 3, user: "Manaschy_Fan", text: "Эпосту бул форматта окуу — башкача бир сезим!", date: "2024-03-20" },
    ],
    chapters: [
      "Пролог: Байыркы замандар",
      "Жаш баатыр",
      "Кыргыз жери",
      "Биринчи душман",
      "Атасынын сабагы",
      "Сынак",
      "Акер-Кабак жортуулу",
      "Жолдоштор",
      "Ак боз ат",
      "Урушка даярдык",
      "Биринчи салгылашуу",
      "Душман аскери",
      "Кайрат",
      "Айгер кыздын күйүтү",
      "Тоо жолу",
      "Байыркы ырым",
      "Жеңиш",
      "Чоң салгылашуу",
      "Сынган кылыч",
      "Жаңы жол",
      "Тоо элинин жардамы",
      "Акыркы жоо",
      "Кыргыздын намысы",
      "Аскерлердин ыры",
      "Кан майдан",
      "Жеңиш күнү",
      "Тынчтык",
      "Эпилог: Мурастары",
    ],
  },
  10: {
    authorNote:
      "Ала-Тоо — бул биздин жашыруун тарыхыбыз. Бул детектив мен аны таап чыгуу аракетим.",
    authorLinks: [
      { platform: "instagram", url: "https://instagram.com/aigul_seitkali" },
      { platform: "telegram", url: "https://t.me/aigul_writer" },
    ],
    likes: 712,
    dislikes: 24,
    comments: [
      { id: 1, user: "KyrgyzMystery", text: "Тоо сырлары мынчалык чыныгы жазылган!", date: "2022-09-10" },
      { id: 2, user: "Детектив_КГ", text: "Финал күтүлбөгөн болду — класс!", date: "2022-11-03" },
    ],
    chapters: [
      "Жок болгон экспедиция",
      "Журналисттин жолу",
      "Биринчи из",
      "Тоо айылы",
      "Сыр",
      "Кечки сааттар",
      "Жергиликтүү аңызы",
      "Коркунучтуу табылга",
      "Куугунтук",
      "Тоонун ичи",
      "Сырдуу документтер",
      "Чыкпай калган сыр",
      "Ачылыш",
      "Кайтуу",
      "Эпилог: Жазылган аңыз",
    ],
  },
  11: {
    authorNote:
      "Бишкектин жүрөгү — бул келечек шаар жөнүндө эмес, ал адамдык сезимдер жөнүндө.",
    authorLinks: [
      { platform: "instagram", url: "https://instagram.com/nurjan_osmonov" },
      { platform: "vk", url: "https://vk.com/nurjan_writer" },
    ],
    likes: 834,
    dislikes: 19,
    comments: [
      { id: 1, user: "SciFiKG", text: "Кыргыз фантастикасы мынчалык деңгээлде болушу мүмкүн экен!", date: "2024-05-15" },
      { id: 2, user: "TechReader", text: "Программисттердин мамилеси абдан табигый берилген.", date: "2024-06-20" },
    ],
    chapters: [
      "Программисттер",
      "Биринчи код",
      "Жаңы долбоор",
      "Робот жана адам",
      "Күтүлбөгөн натыйжа",
      "Сезим",
      "Чек",
      "Корпорация",
      "Байланыш",
      "Биринчи кезде",
      "Сырдуу функция",
      "Ишеним",
      "Кооптонуу",
      "Программанын жүрөгү",
      "Бузулуш",
      "Чечим",
      "Биргелешкен жол",
      "Жаңы заман",
      "Эпилог: Бишкектин жүрөгү",
    ],
  },
  12: {
    authorNote:
      "Комуз — бул биздин боостондугубуздун символу. Бул романды жазганда, мен ошол заманда жашагандай сезиндим.",
    authorLinks: [
      { platform: "instagram", url: "https://instagram.com/zarina_bekova_kg" },
      { platform: "youtube", url: "https://youtube.com/@zarina_bekova" },
    ],
    likes: 921,
    dislikes: 16,
    comments: [
      { id: 1, user: "KomuzFan", text: "Комуздун сүрөттөлүшү жүрөктү тилет!", date: "2022-04-10" },
      { id: 2, user: "HistoryKG", text: "XIX кылымды мынчалык кооз берген чыгарма жок эле.", date: "2022-06-01" },
    ],
    chapters: [
      "Акын кыз",
      "Комуздун тили",
      "Мандап жерде",
      "Бостондук үчүн",
      "Биринчи ыр",
      "Душман",
      "Жаш жүрөк",
      "Тыюу",
      "Жашыруун ыр",
      "Комуз чабуулда",
      "Ашык",
      "Тоонун ыры",
      "Абактан чыгуу",
      "Кандын алдында",
      "Ырдын күчү",
      "Коркуусуз",
      "Майдан алдында",
      "Акыркы ыр",
      "Боштондук",
      "Элдин ыры",
      "Жеңиш ыры",
      "Комуздун үнү",
      "Тынчтык",
      "Эпилог: Аңызга айланды",
    ],
  },
  13: {
    authorNote:
      "Экитилдүү роман жазуу оңой эмес, бирок эки элдин жүрөгүн бир жерге чогултуу мүмкүн экенин далилдегим келди. / Писать на двух языках непросто, но я хотела показать: два народа — одно сердце.",
    authorLinks: [
      { platform: "instagram", url: "https://instagram.com/gulzat_asanova" },
      { platform: "vk", url: "https://vk.com/gulzat_writer" },
      { platform: "telegram", url: "https://t.me/gulzat_asanova" },
    ],
    likes: 1854,
    dislikes: 22,
    comments: [
      { id: 1, user: "BilingualFan", text: "Обе языковые версии читаются как отдельные произведения. Браво!", date: "2024-10-01" },
      { id: 2, user: "Кыргызча_окуучу", text: "Экинчи бөлүктөн жашым чыкты. Жазуу стили кереметтей!", date: "2024-10-15" },
    ],
    chapters: [
      "Пролог: Эки дүйнө / Два мира",
      "Биринчи жолугушуу / Первая встреча",
      "Мөмө бакча / Сад",
      "Сыйкыр / Магия",
      "Чоку / Выбор",
      "Айырма / Разница",
      "Жол башы / Начало пути",
      "Жашыруун / Тайна",
      "Жолдош / Спутник",
      "Тоо / Горы",
      "Кыйынчылык / Испытание",
      "Дос / Друг",
      "Душман / Враг",
      "Сыйкырдуу бөлмө / Волшебная комната",
      "Суроо / Вопрос",
      "Жооп / Ответ",
      "Айырмасыздык / Единство",
      "Күч / Сила",
      "Коркуу / Страх",
      "Ишеним / Доверие",
      "Акыркы чоку / Последний выбор",
      "Жол бирикти / Дороги сошлись",
      "Эки жол / Два пути",
      "Жаны дүйнө / Новый мир",
      "Кечирим / Прощение",
      "Тынчтык / Мир",
      "Эки жүрөк / Два сердца",
      "Жарык / Свет",
      "Ырым / Ритуал",
      "Бирге / Вместе",
      "Жаңы башталыш / Новое начало",
      "Баардыгы / Всё",
      "Эпилог: Бир жол / Один путь",
    ],
  },
};

const DEFAULT_EXTRA: StoryExtra = {
  authorNote:
    "Спасибо всем читателям за поддержку. Эта история — моё сердце на страницах.",
  authorLinks: [{ platform: "vk", url: "https://vk.com" }],
  likes: 512,
  dislikes: 20,
  comments: [
    { id: 1, user: "Читатель_1", text: "Замечательная история, жду продолжения!", date: "2024-01-01" },
    { id: 2, user: "Bookworm42", text: "Очень понравилось, рекомендую всем!", date: "2024-02-10" },
  ],
};

export function getStoryExtra(id: number): StoryExtra {
  return EXTRAS[id] ?? DEFAULT_EXTRA;
}

export function generateChapters(count: number): Chapter[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    title: i === 0 ? "prologue" : i === count - 1 && count > 2 ? "epilogue" : `chapter_${i + 1}`,
  }));
}

/* ── Chapter content (story 1 only for now) ───────────────────────────────── */

const P = [
  // 0
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  // 1
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  // 2
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.",
  // 3
  "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.",
  // 4
  "Ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
  // 5
  "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis rerum necessitatibus saepe eveniet.",
  // 6
  "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  // 7
  "Expetendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud.",
];

const ch = (a: number, b: number, c: number): string[] => [P[a], P[b], P[c]];

const CHAPTER_CONTENT_1: Record<number, string[]> = {
  1:  ch(0, 2, 4),
  2:  ch(1, 3, 5),
  3:  ch(6, 7, 0),
  4:  ch(1, 4, 6),
  5:  ch(2, 5, 7),
  6:  ch(3, 6, 0),
  7:  ch(4, 7, 1),
  8:  ch(5, 0, 2),
  9:  ch(6, 1, 3),
  10: ch(7, 2, 4),
  11: ch(0, 3, 6),
  12: ch(1, 4, 7),
  13: ch(2, 5, 0),
  14: ch(3, 6, 1),
  15: ch(4, 7, 2),
  16: ch(5, 0, 3),
  17: ch(6, 1, 4),
  18: ch(7, 2, 5),
};

const ALL_CHAPTER_CONTENT: Record<number, Record<number, string[]>> = {
  1: CHAPTER_CONTENT_1,
};

export function getChapterContent(storyId: number, chapterNum: number): string[] | null {
  return ALL_CHAPTER_CONTENT[storyId]?.[chapterNum] ?? null;
}

export function hasChapterContent(storyId: number): boolean {
  return storyId in ALL_CHAPTER_CONTENT;
}
