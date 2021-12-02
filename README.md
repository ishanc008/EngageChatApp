<h1 align="center">
Microsoft Engage Chat App
</h1>
<p align="center">
MongoDB, Expressjs, React/Redux, Nodejs , Socket.io
</p>

> Chats app is a website where people can chat with each other and share their thoughts.


## Clone or Download
```terminal
$ git clone https://github.com/ishanc008/EngageChatApp.git
$ npm i
```

## Project Structure
```terminal
.gitignore
server/
   package.json
   index.js
   ...
   ...
client/
   package.json
   index.html
   index.js
   App.js
   ...
   ...
 ```

# Usage (run fullstack app on your machine)

## Prerequirements
- [MongoDB](https://gist.github.com/nrollr/9f523ae17ecdbb50311980503409aeb3)
- [Node](https://nodejs.org/en/download/) ^10.0.0
- [npm](https://nodejs.org/en/download/package-manager/)

Notice, you need client and server runs concurrently in different terminal session, in order to make them talk to each other

## Client-side usage(PORT: 3000)
```terminal
$ cd client   // go to client folder
$ npm i         // npm install pacakges
$ npm start     // run it locally
```

## Server-side usage(PORT: 5001)

### Prepare your secret

run the script at the first level:

(You need to add a SECRET in .env to connect to MongoDB)

```terminal
// in the root level
$ echo "SECRET=YOUR_JWT_SECRET" >> ./Backend/.env
```

### Start

```terminal
$ cd server   // go to server folder
$ npm i       // npm install pacakges
$ npm start // run it locally
```

# Presentation of this video.
[Video](https://www.youtube.com/watch?v=he1_586uR38)

## Standard

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## BUGs or comments

[Create new Issues](https://github.com/ishanc008/EngageChatApp/issues) (preferred)

Email Me: ishanc008@gmail.com 

## Author
[Ishan Chopra](https://github.com/ishanc008)

### License
[MIT](https://github.com/ishanc008/Memories-App/blob/master/LICENSE)
