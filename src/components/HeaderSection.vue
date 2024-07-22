<script setup>
const handleToggleNav = () => {
    document.getElementById('collections').classList.toggle('hidden')
    document.getElementsByTagName('body')[0].classList.toggle('hidden-scroll')
}
</script>

<template>
    <header class="silver-grad shadow flex sm:flex-row flex-col justify-between sm:px-20 sm:py-0 pb-10 items-center header-grad">
        <router-link to='/' class="py-6 flex items-center">
            <img src="/logo_cropped.png" alt="" class="w-10 h-10"/>
            <h1 class="ml-2 text-3xl font-bold tracking-[8px] logo-grad">PALANTIR</h1>
        </router-link>

        <nav class='text-[#63b4c8] font-semibold text-xl flex gap-4'>
            <button class="hover:opacity-50" @click="handleToggleNav">Collections</button>
            <router-link to="/contacts" class="hover:opacity-50">Contacts</router-link>
        </nav>

        <div id="collections" class="fixed top-0 right-0 w-full h-[100vh] bg-gray-700 bg-opacity-70 z-[9999999] hidden">
            <div class="absolute top-0 right-0 h-full bg-[#1a1a1a] p-10 flex flex-col text-[#63b4c8] font-semibold text-xl gap-4 w-full sm:w-auto" @click="handleToggleNav">
                <router-link to="/bm">Bi-Mech</router-link>
                <router-link to="/qp">Quartan Primes</router-link>
                <router-link to="/ap">Alpha Prestige</router-link>
                <router-link to="/pf">Pioneer of Fusionist</router-link>
                <router-link to="/peace">PrimeAce</router-link>
            </div>

            <button class="w-6 h-6 absolute top-3 right-3" @click="handleToggleNav">
                <img src="@/assets/cross.svg">
            </button>
        </div>
    </header>
</template>

<style>
.logo-grad {
    background: linear-gradient(182deg, rgba(249,249,249,1) 0%, rgba(169,229,242,1) 35%, rgba(52,152,219,1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.hide-nav {
    display: none;
}

.header-grad {
    background: linear-gradient(to bottom, rgba(19, 19, 19, 1) 10%, rgba(26, 26, 26, 1) 100%);
}

#collections:hover .hide-nav {
    display: flex;
    width: calc(100% + 20px);
    position: absolute;
    background: #1a1a1a;
    padding: 10px;
    z-index: 999;
    border-radius: 0 0 20px 20px;
    gap: 10px;
}

.hidden-scroll {
    overflow: hidden;
}
</style>