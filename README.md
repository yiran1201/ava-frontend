# Ava Interview Project

- Yiran Chen (02/06/2021)
- Google CLoud Platform(GCP) deploy
- [Alice Entry](https://ava-yiranchen.uc.r.appspot.com/alice)
- [Bob Entry](https://ava-yiranchen.uc.r.appspot.com/bob)

# Code Repository

- [Frontend](https://github.com/yiran1201/ava-frontend)
- [Backend](https://github.com/yiran1201/ava-backend)

## Stacks

- Node.js + Express.js
- React.js + Create React App(CRA)
- Server side cache (mock database, see cache-util.js for details)
- Bootstrap Styling
- SocketIO (server side + client side config)
- Google Cloud Platform (App Engine)

#### Staging run (server side render static build)

- Run `npm install && npm start` on the backend repo
- Then navigate to `http://localhost:5000/`

#### Run local dev

- For backend & APIs, run `npm install && npm start`
- For front end, run `npm install && npm start`
- Navigate to `http://localhost:3000/alice` for client Alice
- Navigate to `http://localhost:3000/bob` for client Bob

#### Project Build and Deploy (GCP)

- warmup configuration for keeping up the server
- set minimum instance to 1 to maintain the running status

## Assignment Requirements

#### APIs

GET / ping

- https://ava-yiranchen.uc.r.appspot.com/ping

GET / info

- https://ava-yiranchen.uc.r.appspot.com/info

POST / mutations

- sample json from production request

```json
{
  "author": "alice",
  "conversationId": "conversation-eb4e6e92-99cd-4bf5-9154-55aeea1fe03c",
  "data": {
    "index": 0,
    "length": 0,
    "text": "Hello ",
    "type": "insert"
  },
  "origin": {
    "alice": 0,
    "bob": 0
  }
}
```

GET / conversationss

- https://ava-yiranchen.uc.r.appspot.com/conversations
- Sample response from production

```json
{
  "conversations": [
    {
      "id": "conversation-eb4e6e92-99cd-4bf5-9154-55aeea1fe03c",
      "lastMutation": {
        "author": "alice",
        "data": {"index": 0, "length": 0, "text": "Hello ", "type": "insert"},
        "origin": {"alice": 0, "bob": 0}
      },
      "text": "Hello Suscipit deserunt optio in ipsam."
    },
    ...
  ],
  "msg": "",
  "ok": true
}
```

DELETE / conversations

- https://ava-yiranchen.uc.r.appspot.com/conversations
- Sample response from postman
- I set this to status 200, as status 204 will not returning any content.

```json
{
  "msg": "",
  "ok": true
}
```

#### UI Design

- TODO

#### Front End

:white_check_mark: Frontend is written in React + Create React App(CRA) SPA setup.

:white_check_mark: Front End(static build) + Backend (NodeJS) deployed on Google Cloud Platform for the sake of: 1. better logging (compare to AWS) 2. better version management system(compare to both) 3. stable up time(compare to Heroku).

:white_check_mark: Assignment answer on [GET / info](https://ava-yiranchen.uc.r.appspot.com/info)

:white_check_mark: See the list of all the conversations
![alt text][conversations]

[conversations](https://res.cloudinary.com/dgiji0wxc/image/upload/v1612657306/ava/screenshot-localhost-3000-bob-1612657068251_rnzct0.png)

:white_check_mark: Delete a conversation

![alt text][delete-conversation]

[delete-conversation](https://res.cloudinary.com/dgiji0wxc/image/upload/v1612657677/ava/screenshot-localhost-3000-bob-1612657592282_due0ma.png)

:white_check_mark: Star / Un-star a conversation (locally only)
![alt text][star-conversation]

[star-conversation](https://res.cloudinary.com/dgiji0wxc/image/upload/v1612657927/ava/screenshot-localhost-3000-bob-1612657870132_vf4ujb.png)

:white_check_mark: Select a conversation and visualize the ALL mutation history on this conversation.
![alt text][select-conversation]

[select-conversation](https://res.cloudinary.com/dgiji0wxc/image/upload/v1612658087/ava/screenshot-localhost-3000-bob-1612658028536_x07ya2.png)

:white_check_mark: Select a conversation and visualize in real time the modifications that applied on this conversation.
![alt text][realtime-conversation]

[realtime-conversation](https://res.cloudinary.com/dgiji0wxc/image/upload/v1612658341/ava/screenshot-localhost-3000-bob-1612658153635_vi6bxw.png)

#### Backend

:white_check_mark: Deployed on a secure endpoint https://ava-yiranchen.uc.r.appspot.com with Google Cloud Platform (GCP)

:white_check_mark: Develop based on Node.js

:white_check_mark: handle JSON-encoded bodies for POST request, use `axios` to handle POST request, by default the header has `Content-type: application/json`

- Sample POST request headers from production

```json
...
content-type: application/json;charset=UTF-8
origin: https://ava-yiranchen.uc.r.appspot.com
referer: https://ava-yiranchen.uc.r.appspot.com/alice
...
```

- backend handle request JSON and url encode

```js
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
```

:white_check_mark: User are able to manage several conversations and they are independent.

:white_check_mark: The project will accept requests from https://app.ava.me (CORS policy)

- Enable CORS from server side

```js
app.use(cors());
```

- Notice: This setup is by purpose (though is not ideal in terms of safety concern); it is just easier, in case you want to access the server from ANYWHERE, the normal way way to handle it is to setup a whitelist.

:white_check_mark: Return 400 errors when http requests are invalid.
![alt text][invalid-response]

[invalid-response](https://res.cloudinary.com/dgiji0wxc/image/upload/v1612659787/ava/Screen_Shot_2021-02-06_at_5.01.38_PM_wmbfzd.png)

## Implement Example

#### Server side socket configuration

```js
export const connectSocket = (server) => {
  const io = SocketIo(server, {cors: {origin: '*'}});
  io.on('connection', (socket) => {
    console.log('Client connected!');
    ...
  });
  io.on('disconnect', () => console.log('User left!!'));
};
```

- Notice: CORS enable all setup is for the convenient of both DEV and PROD env, will turn it off eventually for safety reason.

#### Client side socket configuration

```js
import io from 'socket.io-client';
const IN_PROD = process.env.NODE_ENV === 'production';
const origin = IN_PROD ? '' : 'http://localhost:5000';
const socket = io(origin);
```

#### Build an in-memory database on server (server side cache)

```js
class InMemoryDB {
  constructor() {
    this.resetConversations();
  }
  resetConversations() {
    this.conversations = buildConversations(20);
  }
  ...
}

const db = new InMemoryDB();
export default db;
```

#### Config front end routing

```jsx
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
<BrowserRouter>
  <Switch>
    <Route path='/:author' component={HomePage} />
    <Redirect from='/' to='/alice' />
  </Switch>
</BrowserRouter>;
```

### Config backend API routing

```js
app.get('/ping', getPing);
app.get('/info', getInfo);
app.post('/mutations', handleMutation);
app.get('/conversation/:conversationId', getConversation);
app.delete('/conversation/:conversationId', deleteConversation);
app.post('/conversation', addConversation);
app.get('/reset-conversations', resetConversations);
app.get('/conversations', getConversations);
app.delete('/conversations', clearConversations);
...
```

#### Build front end static files and compile from server

```js
const root = path.join(__dirname, 'build');
app.use('/', Express.static(root));
app.use('/*', (_, response) => response.sendFile(`${root}/index.html`));
```

#### Self generating seed data for testing purpose

```js
import uuid4 from 'uuid4';
import faker from 'faker';

const buildConversations = (sample) => {
  const conversations = [];
  while (conversations.length < sample) {
    const text = faker.lorem.sentence();
    const id = `conversation-${uuid4()}`;
    conversations.push({
      id,
      mutations: [],
      lastMutation: {},
      text,
      origin: {alice: 0, bob: 0},
    });
  }
  return conversations;
};
```

#### Keep the server live on Cloud

```yaml
inbound_services:
  - warmup

automatic_scaling:
  min_instances: 1
  max_instances: 2
```
