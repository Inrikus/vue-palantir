export const platformIcon = {
  Blur: 'marketplace/blur.webp',
  Opensea: 'marketplace/opensea.webp',
  Binance: 'marketplace/logo.png',
  Element: 'marketplace/element.webp',
  OKX: 'marketplace/okx.webp',
  Tesseract: 'marketplace/Tesseract.ico',
  MagicEden: 'marketplace/MagicEden.png'
}

export const currency = {
  'ETH': 'eth.svg',
  'BNB': 'bnb.svg',
  'USDT': 'usdt.svg',
  'ACE': 'ace.svg',
  'WACE': 'wace.svg',
  'Unknown': 'unknown.svg'
}
// ЕДИНЫЙ объект коллекций
export const collections = {
  bi_mech: {
    queryName: 'bi_mech',
    page: { name: 'Bi-Mech', image: 'collections/Bi-mech.webp' },
    banner: { name: 'Bi-Mech', image: '/banner/bm.gif', link_to: '/bi_mech' },
    // при необходимости можно хранить теги статуса/режимы здесь
    status: [],
    sources: ['Element', 'OKX', 'Binance'],
    filters: {
      GRADE: ['Common', 'Elite', 'Epic', 'Legend', 'Mythical'],
      Class: ['Buster', 'Keystone', 'Striker'],
      Weapons: ['1', '2', '3', '4']
    }
  },

  quartan_primes: {
    queryName: 'quartan_primes',
    page: { name: 'Quartan Primes', image: 'collections/Quartan Primes.webp' },
    banner: { name: 'Quartan Primes', image: '/banner/qp.gif', link_to: '/quartan_primes' },
    // в исходнике "Uncreated" применялся к qp и peace — сохраним как метку
    status: ['Uncreated'],
    sources: ['Blur', 'Opensea', 'Element', 'MagicEden', 'OKX', 'Binance'],
    filters: {
      GRADE: ['Elite', 'Epic', 'Legend', 'Mythical'],
      Class: ['Buster', 'Keystone', 'Striker'],
      Weapons: ['2', '3', '4']
    }
  },

  alpha_prestige: {
    queryName: 'alpha_prestige',
    page: { name: 'Alpha Prestige', image: 'collections/Alpha Prestige.webp' },
    banner: { name: 'Alpha Prestige', image: '/banner/ap.gif', link_to: '/alpha_prestige' },
    status: [],
    sources: ['Blur', 'Opensea', 'Element', 'MagicEden', 'OKX', 'Binance'],
    filters: {
      // пусто в исходных данных — оставляем как есть
    }
  },

  pioneer_of_fusionist: {
    queryName: 'pioneer_of_fusionist',
    page: { name: 'Pioneer of Fusionist', image: 'collections/Pioneer of Fusionist.webp' },
    banner: { name: 'Pioneer of Fusionist', image: '/banner/pioneer.png', link_to: '/pioneer_of_fusionist' },
    status: [],
    sources: ['Blur', 'Opensea', 'Element', 'MagicEden', 'OKX'],
    filters: {
      // данных о фильтрах не было — оставляем пусто
    }
  },

  primeace: {
    queryName: 'primeace',
    page: { name: 'PrimeACE', image: 'collections/ace.svg' },
    banner: { name: 'PrimeACE', image: '/banner/peace.png', link_to: '/primeace' },
    status: ['Uncreated'],
    sources: ['Tesseract'],
    filters: {
      Rarity: ['Common', 'Rare', 'Elite', 'Epic', 'Legendary', "Collector's"]
    }
  },

  fusionist_planet: {
    queryName: 'fusionist_planet',
    page: { name: 'Fusionist Planet', image: 'collections/Fusionist Planet.png' },
    banner: { name: 'Fusionist Planet', image: '/banner/planet.png', link_to: '/fusionist_planet' },
    status: [],
    sources: ['Tesseract'],
    filters: {
      Grade: ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5'],
      Helium: ['1', '2', '3', '4', '5'],
      Hydrogen: ['1', '2', '3', '4', '5'],
      Titanium: ['1', '2', '3', '4', '5'],
      Coal: ['1', '2', '3', '4', '5'],
      Sulfur: ['1', '2', '3', '4', '5'],
      Petroleum: ['1', '2', '3', '4', '5'],
      Ecology: ['Grassland', 'Land', 'Ocean', 'Lava', 'Wild', 'Gas', 'Poison', 'Frozen', 'Desert']
    }
  }
}

