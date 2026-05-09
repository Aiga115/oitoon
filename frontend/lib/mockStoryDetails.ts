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

export type Comment = {
  id: number;
  user: string;
  text: string;
  date: string;
};

export type StoryExtra = {
  authorNote: string;
  authorLinks: AuthorLink[];
  comments: Comment[];
  likes: number;
  dislikes: number;
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
    title: i === 0 ? "prologue" : i === count - 1 && count > 2 ? "epilogue" : `chapter_n`,
  }));
}
