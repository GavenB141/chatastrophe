# chatastrophe
A simple chatroom app made with SvelteKit and Bun that assigns random user identities.

Code in the `server` directory runs separately with Bun and the SvelteKit app runs with an environment variable `PUBLIC_WS` pointing to the websocket address of the Bun server.
