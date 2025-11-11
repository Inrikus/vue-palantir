<script setup>
const contacts = [
  {
    name: 'Inrikus',
    title: 'Palantir Creator',
    avatar: '/logo_cropped.png',
    links: [
      { label: 'Telegram', icon: '/social-icons/telegram.svg', url: 'https://t.me/Inrikus' },
      { label: 'X (Twitter)', icon: '/social-icons/x.svg', url: 'https://x.com/MikeSco67162628' },
      { label: 'Discord: inrikus', icon: '/social-icons/discord.svg' },
    ]
  },
  {
    name: 'No_Suli4',
    title: 'UI/UX advisor',
    avatar: '/logo_cropped.png',
    links: [
      { label: 'Telegram', icon: '/social-icons/telegram.svg', url: 'https://t.me/No_Suli4' },
    ]
  }
]
</script>

<template>
  <section class="contacts">
    <div class="hero">
      <h1>Say hello</h1>
      <p>Reach out if you want to collaborate, share alpha or just talk Fusionist.</p>
    </div>

    <article
      v-for="contact in contacts"
      :key="contact.name"
      class="card glass-panel"
    >
      <div class="profile">
        <img :src="contact.avatar" :alt="contact.name" />
        <div>
          <h2>{{ contact.name }}</h2>
          <p>{{ contact.title }}</p>
        </div>
      </div>

      <ul class="links">
        <li v-for="link in contact.links" :key="link.label">
          <img :src="link.icon" alt="" />
          <a v-if="link.url" :href="link.url" target="_blank" rel="noopener">{{ link.label }}</a>
          <span v-else>{{ link.label }}</span>
        </li>
      </ul>
    </article>
  </section>
</template>

<style scoped>
.contacts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 60px 20px;
  align-items: center;
  min-height: 70vh;
}

.hero { text-align: center; max-width: 520px; }
.hero h1 { font-size: 2.4rem; margin-bottom: 0.5rem; }
.hero p { color: rgba(255,255,255,.75); }

.card {
  width: 100%;
  max-width: 460px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile { display: flex; gap: 1rem; align-items: center; }
.profile img { width: 64px; height: 64px; border-radius: 1rem; }
.profile h2 { margin: 0; font-size: 1.6rem; }
.profile p { margin: 0; color: rgba(255,255,255,.65); }

.links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
.links li { display: flex; align-items: center; gap: 0.8rem; font-size: 1rem; }
.links img { width: 22px; height: 22px; }
.links a { color: #63b4c8; text-decoration: none; }
</style>
