<script>


    let room = "";
</script>

<div class="mt-20 flex flex-col mx-auto w-40">
    <input class="w-40" bind:value={room} placeholder="Room name">
    <a class="text-center text-3xl mt-4" href="/{room}" data-sveltekit-preload-data="off" data-sveltekit-preload-code="off">
        <button class="rounded-lg bg-emerald-500 border-2 border-black/50">Join</button>
    </a>
</div>