<script setup>
import { ref } from 'vue';

const contact = ref('')
const message = ref('')

const handleSendMessage = () => {
    if (!contact.value) {
        alert('Please enter contact')
        return
    }

    if (!message.value) {
        alert('Please enter message')
        return
    }

    alert('SOON TOON LATER')
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center text-[#63b4c8] bg-[#1F1F1F] px-2 sm:px-20 py-10 rounded-xl shadow-2xl text-center text-xl">
      <div class="flex flex-col gap-4">
        <h2 class="text-4xl font-semibold">Inrikus</h2>
        <div class="flex flex-col justify-center gap-3">
          <a href="https://t.me/Inrikus"><img src="/social-icons/telegram.svg" alt="" class="inline w-5"> Telegram</a>
          <a href="https://x.com/MikeSco67162628"><img src="/social-icons/x.svg" alt="" class="inline w-5"> X(Twitter)</a>
          <p><img src="/social-icons/discord.svg" class="inline w-5" alt=""> Discord: inrikus</p>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-4xl font-semibold">No_Suli4</h2>
        <div class="flex flex-col justify-center gap-3">
          <a href="https://t.me/No_Suli4"><img src="/social-icons/telegram.svg" class="inline w-5" alt=""> Telegram</a>
          <a href="mailto:sulton.xojaniyazov@gmail.com"><img src="/social-icons/email.svg" class="inline w-5" alt=""> Email</a>
          <p><img src="/social-icons/discord.svg" class="inline w-5" alt=""> Discord: no_suli4</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 mt-10 justify-center items-center text-[#63b4c8] bg-[#1F1F1F] px-20 py-10 rounded-xl shadow-2xl">
        <input type="text" class="p-2 rounded-xl w-full bg-[#1F1F1F] text-[#63b4c8] border-2 border-[#63b4c8] placeholder-change" placeholder="Contact" v-model="contact" />
        <textarea class="p-2 rounded-xl w-full bg-[#1F1F1F] text-[#63b4c8] border-2 border-[#63b4c8] placeholder-change" placeholder="Message..." rows="5" v-model="message"></textarea>
        <button class="rounded-xl py-2 px-6 border-2 font-semibold border-[#63b4c8] hover:bg-gray-700 transition-all" type="submit" @click="handleSendMessage">Send</button>
    </div>
  </div>
</template>

<style>
    .placeholder-change::placeholder {
        color: #63b4c8;
        opacity: 0.6;
    }
</style>
