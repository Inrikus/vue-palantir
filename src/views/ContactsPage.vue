<script setup>
const profile = {
  name: 'Inrikus',
  title: 'Palantir curator & analyst',
  avatar: '/logo_cropped.png',
  links: [
    { label: 'Telegram', icon: '/social-icons/telegram.svg', url: 'https://t.me/Inrikus' },
    { label: 'X (Twitter)', icon: '/social-icons/x.svg', url: 'https://x.com/MikeSco67162628' },
    { label: 'Discord: inrikus', icon: '/social-icons/discord.svg' },
  ]
}
</script>

<template>
  <section class="contacts">
    <div class="hero">
      <h1>Say hello</h1>
      <p>Reach out if you want to collaborate, share alpha or just talk Fusionist.</p>
    </div>

    <article class="card">
      <div class="profile">
        <img :src="profile.avatar" :alt="profile.name" />
        <div>
          <h2>{{ profile.name }}</h2>
          <p>{{ profile.title }}</p>
        </div>
      </div>

      <ul class="links">
        <li v-for="link in profile.links" :key="link.label">
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
  border-radius: 1.5rem;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(5,6,12,.88);
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
