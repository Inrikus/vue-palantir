<script setup>
</script>

<template>
    <header class="silver-grad shadow flex sm:flex-row flex-col justify-between sm:px-20 sm:py-0 pb-10 items-center header-grad">
        <router-link to='/' class="py-6 flex items-center">
            <img src="/logo_cropped.png" alt="" class="w-10 h-10"/>
            <h1 class="ml-2 text-3xl font-bold tracking-[8px] logo-grad">PALANTIR</h1>
        </router-link>

        <nav class='flex gap-2 text-xl font-semibold text-[#63B4C8]'>
            <div id="collections" class='cursor-pointer relative'>Collections
                <div class='hide-nav flex flex-col'>
                    <router-link to="/bm">Bi-Mech</router-link>
                    <router-link to="/qp">Quartan Primes</router-link>
                    <router-link to="/ap">Alpha Prestige</router-link>
                    <router-link to="/peace">PrimeACE</router-link>
                </div>
            </div> 

            <router-link to='/contacts'>Contacts</router-link>
        </nav>
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
</style>