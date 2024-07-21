export const filterList = {
    bm: {
      GRADE: ['Common', 'Elite', 'Epic', 'Legend', 'Mythical'],
      Class: ['Buster', 'Keystone', 'Striker'],
      Weapons: ['1', '2', '3', '4']
    },
    qp: {
      GRADE: ['Elite', 'Epic', 'Legend', 'Mythical'],
      Class: ['Buster', 'Keystone', 'Striker'],
      Weapons: ['2', '3', '4']
    },
    peace: {
      Rarity: ['Common', 'Rare', 'Elite', 'Epic', 'Legendary', "Collector's"]
    },
    ap: {},
    pf: {}
}

export const filterSource = {
    bm: ['Element', 'OKX', 'Binance'],
    qp: ['Blur', 'Opensea', 'Element', 'OKX', 'Binance'],
    peace: ['Tesseract'],
    ap: ['Blur', 'Opensea', 'Element', 'OKX', 'Binance'],
    pf: ['Blur', 'Opensea', 'Element', 'OKX']
}

export const platformIcon = {
  Blur: 'marketplace/blur.webp',
  Opensea: 'marketplace/opensea.webp',
  Binance: 'marketplace/logo.png',
  Element: 'marketplace/element.webp',
  OKX: 'marketplace/okx.webp',
  Tesseract: 'marketplace/Tesseract.ico'
}

export const queryName = {
  peace: 'PrimeACE',
  qp: 'Quartan Primes',
  bm: 'Bi-Mech',
  ap: 'Alpha Prestige',
  pf: 'Pioneer of Fusionist'
}

export const pageNames = {
  bm: { name: 'Bi-Mech', link: "collections/Bi-mech.webp" },
  qp: { name: 'Quartan Primes', link: "collections/Quartan Primes.webp" },
  ap: { name: 'Alpha Prestige', link: "collections/Alpha Prestige.webp" },
  peace: {name: 'PrimeACE', link: "collections/ace.svg"},
  pf: { name: 'Pioneer of Fusionist', link: "collections/Pioneer of Fusionist.webp" }
}

export const bannerLinks = {
  Bi_Mech: {
    name: 'Bi-Mech',
    image: "/banner/bm.gif",
    link_to: '/bm'
  },
  Quartan_Primes: {
    name: 'Quartan Primes',
    image: "/banner/qp.gif",
    link_to: '/qp'
  },
  Alpha_Prestige: {
    name: 'Alpha Prestige',
    image: "/banner/ap.gif",
    link_to: '/ap'
  },
  PrimeACE: {
    name: 'PrimeACE',
    image: "/banner/peace.png",
    link_to: '/peace'
  },
  'Pioneer of Fusionist': {
    name: 'Pioneer of Fusionist',
    image: "/banner/pioneer.png",
    link_to: '/pf'
  }
}

export const currency = {
  'ETH': 'eth.svg',
  'BNB': 'bnb.svg',
  'USDT': 'usdt.svg',
  'ACE': 'ace.svg'
}