export const constants = {
    sockeUrl: 'http://localhost:3000',
    socketNamespaces: {
        room: 'room',
        lobby: 'lobby'
    },
    peerConfig: Object.values({
        id: undefined,
        // config: {
        //     port: 9000,
        //     host: 'localhost',
        //     path: '/'
        // }
    }),
    pages: {
        lobby: '/pages/lobby',
        login: '/pages/loggin'
    },
    events: {
        USER_CONNECTED: 'userConnection',
        USER_DISCONNECTED: 'userDisconnection',

        JOIN_ROOM: 'joinRoom',

        LOBBY_UPDATED: 'lobbyUpdated',
        UPGRADE_USER_PERMISSION: 'upgradeUserPermission',

        SPEAK_REQUEST: 'speakRequest',
        SPEAK_ANSWER: 'speakAnswer',
    },
    firebaseConfig: {
        apiKey: "AIzaSyCkRbNWaIYg9bx4bfn7glnTPEGRITQxUOA",
        authDomain: "dwll-semanajs-expert.firebaseapp.com",
        projectId: "dwll-semanajs-expert",
        storageBucket: "dwll-semanajs-expert.appspot.com",
        messagingSenderId: "312156268657",
        appId: "1:312156268657:web:206b21a29116a0e1a4d3d0",
        measurementId: "G-NDJB7QTE3E"
    },
    storageKey: 'jsexpert:storage:user'
}