// Each chapter is a vertical-scroll "webtoon" strip composed of sequential panel images.
// For testing, every panel uses the same placeholder image.
const PANEL_IMAGE = "/comic-panel-test.jpg";
const PANELS_PER_CHAPTER = 8; // repeat the test image 8× per chapter

// Only comic 201 has chapter content for now (testing phase).
const COMICS_WITH_CHAPTERS = new Set([201]);

export type ComicPanels = string[]; // ordered array of image src paths

export type ComicComment = {
  id: number;
  user: string;
  text: string;
  date: string;
};

export type ComicExtra = {
  authorNote: string;
  authorLinks: { platform: string; url: string }[];
  chapters: string[];
  likes: number;
  dislikes: number;
  comments: ComicComment[];
};

function panels(): ComicPanels {
  return Array.from({ length: PANELS_PER_CHAPTER }, () => PANEL_IMAGE);
}

/** Returns true only for comics that have chapter reader content. */
export function hasComicChapterContent(id: number): boolean {
  return COMICS_WITH_CHAPTERS.has(id);
}

const COMIC_EXTRAS: Record<number, ComicExtra> = {
  201: {
    authorNote:
      "Стальной Дозор начинался как скетчбук о роботах. Рад, что история выросла во что-то большее — благодарю каждого читателя!",
    authorLinks: [
      { platform: "vk", url: "https://vk.com/roman_vlasov_comics" },
      { platform: "telegram", url: "https://t.me/vlasov_draws" },
    ],
    likes: 2140,
    dislikes: 63,
    chapters: Array.from({ length: 24 }, (_, i) =>
      [
        "Пролог: Последний город",
        "Пробуждение дозора",
        "Стальные когти",
        "Подземный завод",
        "Первая волна",
        "Сигнал тревоги",
        "Новобранцы",
        "Механический страж",
        "Ночная засада",
        "Сломанный щит",
        "Сердце машины",
        "Тайный код",
        "Предатель среди нас",
        "Плавильная камера",
        "Последний резерв",
        "Контратака",
        "Падение башни",
        "Электрический шторм",
        "Осада",
        "Герой из стали",
        "Потеря",
        "Перелом",
        "Заря нового мира",
        "Эпилог: Дозор продолжается",
      ][i] ?? `Глава ${i + 1}`
    ),
    comments: [
      { id: 1, user: "IronFan", text: "Рисунок роботов просто невероятный! Жду каждый выпуск.", date: "2024-02-10" },
      { id: 2, user: "PostApocFan", text: "Атмосфера конца света передана идеально.", date: "2024-03-05" },
      { id: 3, user: "Zara_K", text: "Персонажи живые даже под бронёй. Топ!", date: "2024-04-18" },
    ],
  },
  202: {
    authorNote:
      "Девять Небес — история о нашей мифологии, которую я хотела сохранить для нового поколения.",
    authorLinks: [
      { platform: "instagram", url: "https://instagram.com/aydana_bekova_art" },
    ],
    likes: 1876,
    dislikes: 29,
    chapters: [],
    comments: [
      { id: 1, user: "MythLover", text: "Наконец комикс о нашей мифологии! Горжусь!", date: "2024-05-01" },
      { id: 2, user: "ArtFan_99", text: "Иллюстрации — это настоящее искусство.", date: "2024-06-15" },
    ],
  },
  203: {
    authorNote:
      "Ночной Базар — это любовное письмо восточным рынкам и их тайнам. Смешивал реализм с фантастикой до нужной пропорции.",
    authorLinks: [
      { platform: "telegram", url: "https://t.me/karim_yusupov_draws" },
    ],
    likes: 1320,
    dislikes: 44,
    chapters: [],
    comments: [
      { id: 1, user: "ComedyFan", text: "Детектив-растяпа — лучший персонаж сезона!", date: "2023-08-20" },
    ],
  },
  204: {
    authorNote:
      "Хроники Арала — история боли, которую нельзя забыть. Рисовала с дрожащими руками, но это было необходимо.",
    authorLinks: [
      { platform: "instagram", url: "https://instagram.com/dina_seitkali" },
      { platform: "website",   url: "https://dinaseitkali.art" },
    ],
    likes: 2830,
    dislikes: 18,
    chapters: [],
    comments: [
      { id: 1, user: "EcoReader",         text: "Плакала на каждой странице. Важная история.", date: "2024-01-10" },
      { id: 2, user: "КазахскийЧитатель", text: "Спасибо за память о нашем море.",             date: "2024-02-28" },
    ],
  },
  205: {
    authorNote:
      "Кибер Алматы вырос из ночных прогулок по городу и вопроса: а что если все эти экраны следят за тобой?",
    authorLinks: [
      { platform: "twitter",  url: "https://twitter.com/zhansaya_art" },
      { platform: "telegram", url: "https://t.me/zhansaya_omarova" },
    ],
    likes: 1650,
    dislikes: 55,
    chapters: [],
    comments: [
      { id: 1, user: "CyberFan", text: "Лучший киберпанк в СНГ! Отдельный восторг от деталей улиц.", date: "2024-07-01" },
    ],
  },
  206: {
    authorNote:
      "Духи Тянь-Шаня — мой личный страх и восторг перед горами, переведённые в картинки.",
    authorLinks: [
      { platform: "vk", url: "https://vk.com/nurbek_toktogul" },
    ],
    likes: 980,
    dislikes: 37,
    chapters: [],
    comments: [
      { id: 1, user: "HorrorFan", text: "Жуткая и красивая одновременно. Не могу оторваться!", date: "2024-03-22" },
    ],
  },
  207: {
    authorNote:
      "Красный Песок написан под впечатлением от экспедиции в Таджикистан. Пустыня меняет людей.",
    authorLinks: [
      { platform: "instagram", url: "https://instagram.com/firuza_nazarova_art" },
    ],
    likes: 1100,
    dislikes: 42,
    chapters: [],
    comments: [
      { id: 1, user: "ArcheoLover", text: "Романтика и история — идеальное сочетание!", date: "2023-05-11" },
    ],
  },
  208: {
    authorNote:
      "Мегаполис Z — крик против систем, которые делают нас невидимыми. Курьер — это мы все.",
    authorLinks: [
      { platform: "telegram", url: "https://t.me/anton_krylov_art" },
      { platform: "vk",       url: "https://vk.com/megapolis_z_comic" },
    ],
    likes: 2010,
    dislikes: 71,
    chapters: [],
    comments: [
      { id: 1, user: "DystopiaFan", text: "Читается как репортаж из близкого будущего. Жутковато актуально.", date: "2024-09-01" },
      { id: 2, user: "UrbanArt",    text: "Городские пейзажи сделаны с душой.", date: "2024-10-15" },
    ],
  },
};

const FALLBACK_EXTRA: ComicExtra = {
  authorNote: "Спасибо за чтение!",
  authorLinks: [],
  chapters: [],
  likes: 0,
  dislikes: 0,
  comments: [],
};

export function getComicExtra(id: number): ComicExtra {
  return COMIC_EXTRAS[id] ?? FALLBACK_EXTRA;
}

/** Returns the ordered list of panel image paths for a given chapter. */
export function getComicPanels(_id: number, _chapterNum: number): ComicPanels {
  return panels();
}
