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
    ap: {}
}

export const filterSource = {
    bm: ['Element', 'OKX', 'Binance'],
    qp: ['Blur', 'Opensea', 'Element', 'OKX', 'Binance'],
    peace: ['Tesseract'],
    ap: ['Blur', 'Opensea', 'Element', 'OKX', 'Binance']
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
  ap: 'Alpha Prestige'
}

export const pageNames = {
  bm: { name: 'Bi-Mech', link: "collections/Bi-mech.webp" },
  qp: { name: 'Quartan Primes', link: "collections/Quartan Primes.webp" },
  ap: { name: 'Alpha Prestige', link: "collections/Alpha Prestige.webp" },
  peace: {name: 'PrimeACE', link: "collections/ace.svg"}
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
  }
}