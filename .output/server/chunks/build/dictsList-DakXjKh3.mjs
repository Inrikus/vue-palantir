const getCollectionLink = {
  bi_mech: {
    Element: "https://element.market/collections/bi-mech",
    OKX: "https://www.okx.com/ru/web3/marketplace/nft/collection/bsc/bi-mech",
    default: "https://element.market/collections/bi-mech"
  },
  quartan_primes: {
    Opensea: "https://opensea.io/collection/fusionist-quartan-primes",
    Blur: "https://blur.io/eth/collection/fusionist-quartan-primes",
    Element: "https://element.market/collections/fusionist-quartan-primes",
    OKX: "https://www.okx.com/ru/web3/marketplace/nft/collection/eth/fusionist-quartan-primes",
    MagicEden: "https://magiceden.io/ru/collections/ethereum/0xd396e2018b67446b134c30a89166487a8b2abd2e",
    default: "https://element.market/collections/fusionist-quartan-primes"
  },
  alpha_prestige: {
    Opensea: "https://opensea.io/assets/ethereum/0xcbeb9b45ba9fbfbbccc289ee48dadd6fb65ae2a7",
    Blur: "https://blur.io/eth/collection/alpha-prestige-fusionist-official",
    Element: "https://element.market/collections/alpha-prestige-fusionist-official",
    OKX: "https://www.okx.com/ru/web3/marketplace/nft/collection/eth/alpha-prestige-fusionist",
    MagicEden: "https://magiceden.io/ru/collections/ethereum/0xcbeb9b45ba9fbfbbccc289ee48dadd6fb65ae2a7",
    default: "https://element.market/collections/alpha-prestige-fusionist-official"
  },
  pioneer_of_fusionist: {
    Opensea: "https://opensea.io/assets/ethereum/0x4e475806fbc814d6b7b8426d5e183722b2603d4b",
    Blur: "https://blur.io/eth/collection/pioneer-of-fusionist",
    Element: "https://element.market/collections/pioneer-of-fusionist",
    OKX: "https://web3.okx.com/ru/nft/collection/eth/pioneer-of-fusionist",
    MagicEden: "https://magiceden.io/ru/collections/ethereum/0x4e475806fbc814d6b7b8426d5e183722b2603d4b",
    default: "https://element.market/collections/pioneer-of-fusionist"
  },
  fusionist_planet: {
    Tesseract: "https://www.tesseract.world/nfts/list/648-0x7db2ee56b2c19ea0758631c24415ce3a5ec498f5",
    default: "https://www.tesseract.world/nfts/list/648-0x7db2ee56b2c19ea0758631c24415ce3a5ec498f5"
  },
  primeace: {
    Tesseract: "https://www.tesseract.world/nfts/list/648-0xaf8ef2b180fe7cade68643705adae08d1d2791a1",
    default: "https://www.tesseract.world/nfts/list/getCollectionLink"
  }
};
const platformIcon = {
  Blur: "/marketplace/blur.webp",
  Opensea: "/marketplace/opensea.webp",
  Binance: "/marketplace/logo.png",
  Element: "/marketplace/element.webp",
  OKX: "/marketplace/okx.webp",
  Tesseract: "/marketplace/Tesseract.ico",
  MagicEden: "/marketplace/MagicEden.png"
};
const currency = {
  "ETH": "eth.svg",
  "BNB": "bnb.svg",
  "USDT": "usdt.svg",
  "ACE": "ace.svg",
  "WACE": "wace.svg",
  "Unknown": "unknown.svg"
};
const collections = {
  bi_mech: {
    queryName: "bi_mech",
    page: { name: "Bi-Mech", image: "/collections/Bi-mech.webp" },
    // banner: { name: 'Bi-Mech', image: '/banner/bm.gif', link_to: '/collections/bi_mech' },
    banner: { name: "Bi-Mech", image: "/banner/Bi-Mech-2464.jpg", link_to: "/collections/bi_mech" },
    // при необходимости можно хранить теги статуса/режимы здесь
    status: [],
    sources: ["Element", "OKX", "Binance"],
    filters: {
      GRADE: ["Common", "Elite", "Epic", "Legend", "Mythical"],
      Class: ["Buster", "Keystone", "Striker"],
      Weapons: ["1", "2", "3", "4"]
    }
  },
  quartan_primes: {
    queryName: "quartan_primes",
    page: { name: "Quartan Primes", image: "/collections/Quartan Primes.webp" },
    //banner: { name: 'Quartan Primes', image: '/banner/qp.gif', link_to: '/collections/quartan_primes' },
    banner: { name: "Quartan Primes", image: "/banner/QuartanPrimes-638.jpg", link_to: "/collections/quartan_primes" },
    // в исходнике "Uncreated" применялся к qp и peace — сохраним как метку
    status: ["Uncreated"],
    sources: ["Blur", "Opensea", "Element", "MagicEden", "OKX", "Binance"],
    filters: {
      GRADE: ["Elite", "Epic", "Legend", "Mythical"],
      Class: ["Buster", "Keystone", "Striker"],
      Weapons: ["2", "3", "4"]
    }
  },
  alpha_prestige: {
    queryName: "alpha_prestige",
    page: { name: "Alpha Prestige", image: "/collections/Alpha Prestige.webp" },
    // banner: { name: 'Alpha Prestige', image: '/banner/ap.gif', link_to: '/collections/alpha_prestige' },
    banner: { name: "Alpha Prestige", image: "/banner/Alpha Prestige-1.jpg", link_to: "/collections/alpha_prestige" },
    status: [],
    sources: ["Blur", "Opensea", "Element", "MagicEden", "OKX", "Binance"],
    filters: {
      // пусто в исходных данных — оставляем как есть
    }
  },
  pioneer_of_fusionist: {
    queryName: "pioneer_of_fusionist",
    page: { name: "Pioneer of Fusionist", image: "/collections/Pioneer of Fusionist.webp" },
    banner: { name: "Pioneer of Fusionist", image: "/banner/pioneer.png", link_to: "/collections/pioneer_of_fusionist" },
    status: [],
    sources: ["Blur", "Opensea", "Element", "MagicEden", "OKX"],
    filters: {
      // данных о фильтрах не было — оставляем пусто
    }
  },
  primeace: {
    queryName: "primeace",
    page: { name: "PrimeACE", image: "/collections/ace.svg" },
    banner: { name: "PrimeACE", image: "/banner/peace.png", link_to: "/collections/primeace" },
    status: ["Uncreated"],
    sources: ["Tesseract"],
    filters: {
      Rarity: ["Common", "Rare", "Elite", "Epic", "Legendary", "Collector's"]
    }
  },
  fusionist_planet: {
    queryName: "fusionist_planet",
    page: { name: "Fusionist Planet", image: "/collections/Fusionist Planet.png" },
    banner: { name: "Fusionist Planet", image: "/banner/planet.png", link_to: "/collections/fusionist_planet" },
    status: [],
    sources: ["Tesseract"],
    filters: {
      Grade: ["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5"],
      Helium: ["1", "2", "3", "4", "5"],
      Hydrogen: ["1", "2", "3", "4", "5"],
      Titanium: ["1", "2", "3", "4", "5"],
      Coal: ["1", "2", "3", "4", "5"],
      Sulfur: ["1", "2", "3", "4", "5"],
      Petroleum: ["1", "2", "3", "4", "5"],
      Ecology: ["Grassland", "Land", "Ocean", "Lava", "Wild", "Gas", "Poison", "Frozen", "Desert"]
    }
  }
};

export { currency as a, collections as c, getCollectionLink as g, platformIcon as p };
//# sourceMappingURL=dictsList-DakXjKh3.mjs.map
