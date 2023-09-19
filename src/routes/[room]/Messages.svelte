<script lang=ts>
    import type { User, Message } from "../../../server";

    export let messages:Message[] = [];

    $: messages.reverse()

    export let users:User[] = [];
</script>

<div class="flex flex-col-reverse gap-2 w-full overflow-y-scroll grow pb-20">
    {#each messages as m}
        <div class="flex flex-row w-full px-3">
            <img class="w-10 h-10 rounded-full mr-2" src={m.user.avatar_url} alt=""/>
            <div class="flex flex-col">
                <div class={`text-lg ${m.user.id==users[0].id?"text-emerald-300":''}`}>{m.user.name}</div>
                <p class="text-white/70 ml-1">{m.content}</p>
            </div>
        </div>
    {/each}
</div>