# Step to do WebRTC through PeerJS

1. Go to peerjs websitef for our references.
https://peerjs.com/

2. Copy the library the link below and put in index.html:
<script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>

3. Insert "esModuleInterop": true to tsconfig.json:
    "compilerOptions": {
        ....
        "esModuleInterop": true,
        ....
    }

4. In home.page.ts, Do a function for connect and received data. Test the data connection by pressing button.
5. Create input for inserting peerID and button to connect to peer.
6. In home.page.html, do div to show the video later.
7. In home.page.ts, do a function for video peer connection. Don't forget to on audio by set it to true.
8. In home.page.ts, do a fuction to open camera at first.
9. In home.page.ts, do a function to on/off video.
10. In home.page.ts, do a function to mute/off audio.
11. Install the socket io by:
npm install ngx-socket-io 
12. In app/polyfills.ts, at the end to add one more line:
/***************************************************************************************************
 * APPLICATION IMPORTS
 */
(window as any).global = window;

13. In app.module.ts, import the socket-io.
14. In ngOnInit(), do the program setTimeout and socket event to display all video connected.
15. Create the available functions.