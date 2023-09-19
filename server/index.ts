import { faker } from "@faker-js/faker"
import { ServerWebSocket } from "bun"

export type User = {
    name:string,
    avatar_url:string,
    room:string,
    id:string
}

export type Message = {
    user:User,
    content:string,
    time:number
}
function generate_user_agent(room:string):User {

    return {
        name:faker.word.adjective()+faker.word.noun(),
        avatar_url:faker.image.avatar(),
        room,
        id: crypto.randomUUID()
    }
}

const users:ServerWebSocket<User>[] = [];
const messages:Message[] = [];

function update_user_list(room:string) {
    let list:User[] = [];
    users.forEach(u=>{
        if(u.data.room == room) {
            list.push(u.data)
        }
    })

    users.forEach(u=>{
        list[0] = list.splice(list.indexOf(u.data), 1, list[0])[0];
        if(u.data.room == room) {
            u.send(`userlist:${JSON.stringify(list)}`)
        }
    })
}

function update_messages(room:string) {
    let list:Message[] = [];
    messages.forEach(m=>{
        if(m.user.room == room) {
            list.push(m)
        }
    })

    users.forEach(u=>{
        if(u.data.room == room) {
            u.send(`messages:${JSON.stringify(list)}`)
        }
    })
}

Bun.serve<User>({
    fetch(req, server) {        
        let user = generate_user_agent(new URL(req.url).pathname);

        if (server.upgrade(req, {
            data: user
        })) return;
        return new Response("Upgrade failed :(", { status: 500 });
    },
    websocket: {
        open(ws) {
            console.log("New connection from " + ws.data.name + " in room " + ws.data.room);
            users.push(ws);
            update_user_list(ws.data.room);
            update_messages(ws.data.room);
        },

        message(ws, message) {
            if((<string>message).startsWith("message:")) {
                messages.push(JSON.parse(<string>message.slice(8)));
                update_messages(ws.data.room);
            }
        },

        close(ws) {
            console.log(`${users.splice(users.indexOf(users.filter(u=>u==ws)[0]), 1)[0].data.name} disconnected`);
            update_user_list(ws.data.room);
            ws.close();
        }
    },
    port:8080
});