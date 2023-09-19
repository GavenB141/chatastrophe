<script lang=ts>
    import { onDestroy, onMount } from "svelte";
    import type { User, Message } from "../../../server";
    import UserList from "./UserList.svelte";
    import Messages from "./Messages.svelte";
    import { fade } from "svelte/transition";
    import { PUBLIC_WS } from "$env/static/public";

    export let data:{
        room:string
    };

    let socket:WebSocket;
    let messages:Message[] = [];
    let users:User[] = [];

    let signal=0;

    onMount(()=>{
        signal += 1;

        socket = new WebSocket(PUBLIC_WS + data.room);

        socket.addEventListener("open", e=>{})

        socket.addEventListener("message", e=>{
            if(e.data.startsWith("userlist:"))
                users = <User[]>(JSON.parse(e.data.slice(9)))
            if(e.data.startsWith("messages:"))
                messages = <Message[]>(JSON.parse(e.data.slice(9)))
        })
    })

    onDestroy(()=>{
        if(socket)
            socket.close();
    })

    let draft="";
    function send_message() {
        let message:Message = {
            user:users[0],
            content:draft,
            time:Date.now()
        };

        socket.send(`message:${JSON.stringify(message)}`);

        draft = "";
    }
</script>

{#if users.length > 0}
    <div style="max-width:480px; max-height:850px" class="mx-auto h-full relative bg-black/50 md:rounded-b-2xl flex flex-col">
        <div class="flex flex-row w-full justify-between items-center relative">
            <p class="text-2xl ml-3">Chatastrophe</p>
            <UserList {users}/>
        </div>
        <Messages {messages} {users} />
        <form class="absolute bottom-0 w-full flex flex-row pb-1 items-center">
            <input bind:value={draft} class="m-2 grow min-w-0" placeholder="Send a message..."/>
            <button on:click={send_message} class="text-3xl py-0 h-12 mr-2">󰒊</button>
        </form>
    </div>
{:else}
    {#if signal===0}
        <center out:fade={{delay:4000, duration:1000}} class="mt-10 p-2 font-bold">Loading ...</center>
    {/if}
    {#key signal}
        <center in:fade={{delay:5000, duration:1000}} class="mt-10 p-2 font-bold">Server unavailable</center>
    {/key}
{/if}