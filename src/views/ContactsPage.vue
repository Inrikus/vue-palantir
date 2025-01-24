<script setup>
import { computed } from 'vue';

// EVM адрес для поддержки
const evmAddress = '0x184996687453e38d85c81dd694880271c4ab9c9e'; // Пример EVM адреса
// Функция для копирования адреса в буфер обмена
const copyToClipboard = () => {
  navigator.clipboard.writeText(evmAddress).then(() => {
    alert('Address copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy address: ', err);
  });
};

// Список контактов
const contacts = [
  {
    name: 'Inrikus',
    links: [
      { type: 'telegram', url: 'https://t.me/Inrikus', text: 'Telegram' },
      { type: 'x', url: 'https://x.com/MikeSco67162628', text: 'X (Twitter)' },
      { type: 'discord', text: 'Discord: inrikus' },
    ],
  },
  {
    name: 'No_Suli4',
    links: [
      { type: 'telegram', url: 'https://t.me/No_Suli4', text: 'Telegram' },
      { type: 'email', url: 'mailto:sulton.xojaniyazov@gmail.com', text: 'Email' },
      { type: 'discord', text: 'Discord: no_suli4' },
    ],
  },
];

// Фильтрация ссылок с/без URL
const filteredContacts = computed(() => {
  return contacts.map(contact => ({
    ...contact,
    linksWithUrl: contact.links.filter(link => link.url),
    linksWithoutUrl: contact.links.filter(link => !link.url),
  }));
});
</script>

<template>
  <div class="contact-page">
    <!-- Заголовок страницы -->
    <h1 class="page-title">Contact Us</h1>

    <!-- Контейнер для карточек -->
    <div class="contact-container">
      <div v-for="contact in filteredContacts" :key="contact.name" class="contact-card">
        <!-- Имя контакта -->
        <h2 class="contact-name">{{ contact.name }}</h2>

        <!-- Ссылки -->
        <div class="contact-links">
          <!-- Ссылки с URL -->
          <a v-for="(link, index) in contact.linksWithUrl" :key="index" :href="link.url" target="_blank"
            class="contact-link">
            <img :src="`/social-icons/${link.type}.svg`" alt="" class="contact-icon" />
            {{ link.text }}
          </a>

          <!-- Ссылки без URL -->
          <p v-for="(link, index) in contact.linksWithoutUrl" :key="index" class="contact-text">
            <img :src="`/social-icons/${link.type}.svg`" alt="" class="contact-icon" />
            {{ link.text }}
          </p>
        </div>
      </div>
    </div>
    
    <!-- Блок Donate/Support -->
    <div class="donate-section">
      <h3 class="donate-title">Support Us</h3>
      <div class="donate-address">
        <p class="evm-address">{{ evmAddress }}</p>
        <button @click="copyToClipboard" class="copy-btn">
          Copy Address
        </button>
      </div>
    </div>
  
  </div>
</template>

<style scoped>
/* Главная страница */
.contact-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8));
  /* Фон с градиентом */
  color: #f0f0f0;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  border-radius: 15px;
  /* Скругленные углы фона */
  position: relative;
  /* Для правильного отображения дочерних элементов */
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
  /* Тень для фона */
}

/* Заголовок страницы */
.page-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #63b4c8;
  margin-bottom: 40px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.6);
  z-index: 1;
  /* Чтобы заголовок был над фоном */
}

/* Контейнер карточек */
.contact-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  z-index: 1;
  /* Чтобы карточки были над фоном */
} 

/* Карточка контакта */
.contact-card {
  background: #ffffff0d;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s, box-shadow 0.2s;
  backdrop-filter: blur(10px);
}

.contact-card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.8);
}

/* Имя контакта */
.contact-name {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #63b4c8;
  text-align: center;
}

/* Ссылки */
.contact-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-link,
.contact-text {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: #f0f0f0;
  text-decoration: none;
  transition: color 0.3s, transform 0.2s;
}

.contact-link:hover {
  color: #63b4c8;
  transform: translateX(5px);
}

.contact-text {
  opacity: 0.8;
}

/* Иконки */
.contact-icon {
  width: 24px;
  height: 24px;
}

/* Донаты */
.donate-section {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 15px;
  margin-top: 40px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
}

.donate-title {
  font-size: 1.5rem;
  color: #63b4c8;
  margin-bottom: 15px;
}

.donate-address {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.evm-address {
  font-size: 1rem;
  color: #f0f0f0;
  word-wrap: break-word;
  margin-bottom: 10px;
  max-width: 300px;
  word-break: break-all;
}

.copy-btn {
  background-color: #63b4c8;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.copy-btn:hover {
  background-color: #50a0b0;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.2rem;
  }

  .contact-card {
    padding: 15px;
  }

  .contact-name {
    font-size: 1.4rem;
  }

  .contact-link,
  .contact-text {
    font-size: 0.9rem;
  }
}
</style>
