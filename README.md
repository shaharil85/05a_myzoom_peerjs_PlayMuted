# Step to do WebRTC/Zoom Clone using PeerJS and Socket IO

1. Go to peerjs websitef for our references.
https://peerjs.com/

2. Copy the library from link below and put in index.html:
<script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>

3. In tsconfig.json, insert "esModuleInterop": true:
    "compilerOptions": {
        ....
        "esModuleInterop": true,
        ....
    }

4. Install the socket io by:
npm install ngx-socket-io --save

5. In app/polyfills.ts, at the end to add one more line:
 
 (window as any).global = window;

6. In app.module.ts, import the socket-io.

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, SocketIoModule.forRoot(config)],

7. In ngOnInit(), do the program setTimeout and socket event to display all video connected.

8. Do others available functions.