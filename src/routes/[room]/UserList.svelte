<script>
    import { slide } from "svelte/transition";

    export let users;

    let show = false
</script>

<button on:click={()=>show=true} class={`text-3xl m-2 ${show?"opacity-0":""}`}></button>

{#if show}
    <div transition:slide={{axis:"x"}} class="absolute top-0 right-0 p-2 bg-black/50 rounded-bl-lg">
        <div class="flex flex-row items-start">
            <div class="flex flex-col gap-2">
                <p class="font-bold text-2xl p-1">Users</p>
                {#each users as user, i (user.id)}
                    <div class="flex flex-row items-center font-bold" transition:slide>
                        <img class="w-10 h-10 rounded-full mr-2" src={user.avatar_url} alt=""/>
                        <div class={`${i==0?"text-emerald-300":""}`}>{user.name}</div>
                    </div>
                {/each}
            </div>
            <button on:click={()=>show=false} class="text-3xl"></button>
        </div>
    </div>
{/if}