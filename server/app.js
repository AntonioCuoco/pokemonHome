const express = require('express');
const { Server } = require("socket.io");
const { hashPassword, comparePassword } = require('./helpers/auth');
const User = require('./models/user');
const GoogleUser = require('./models/googleUser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { mongoose } = require('mongoose');
const http = require("http");
const Message = require("./models/message");
const { isNilOnly } = require("./utils/utils");
const GoogleUserModel = require('./models/googleUser');
const PrivateChat = require('./models/privateChat');
const PokemonTeam = require('./models/pokemonTeam');
const axios = require('axios');
const PastTournament = require('./models/pastTournament');
const app = express();
app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173'
	})
)
// app.use('/', require('./routes/authRoutes'));

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: '*', // Puoi specificare l'URL del tuo client React invece di '*'
		methods: ['GET', 'POST'],
	},
});

mongoose.connect(process.env.MONGO_URL).then(console.log('connected')).catch((error) => console.log(error));

app.get('/retrieveTournamentByDate', async (req, res) => {
	const actualDate = new Date();
	const isoDate = actualDate.toISOString();
	console.log('dateActual', isoDate);
	const tournament = await PastTournament.find({
		$or: [
			{ dataInizio: { $gt: isoDate } },
			{ $and: [{ dataInizio: { $gte: isoDate } }, { dataFine: { $lte: isoDate } }] }
		]
	});
	console.log('tournament', tournament);
	res.status(200).json(tournament);
})

app.get('/retrieveTournament', async (req, res) => {
	const tournament = await PastTournament.find({});
	console.log('tournament', tournament);
	res.status(200).json(tournament);
})

app.post('/savePokemonTeam', async (req, res) => {
	const { nameTeam, nameUser, selectedPokemon } = req.body;

	const team = await PokemonTeam.create({
		nameTeam: nameTeam,
		nameUser: nameUser,
		teamArray: selectedPokemon
	})

	if (team) {
		return res.status(200).json('operazione eseguita con successo');
	}
	res.status(500).json('errore nella creazione del team, riprovare');
});

app.post('/getPokemonTeam', async (req, res) => {
	const { nameUser } = req.body;

	const team = await PokemonTeam.find({
		nameUser: nameUser,
	})

	console.log('team', team);

	if (team) {
		return res.status(200).json(team);
	}
	res.status(500).json('non ci sono team a te associati, creane uno');
});

app.post('/changePassword', async (req, res) => {
	const { actualPassword, newPassword, email } = req.body;

	console.log("pre", actualPassword, newPassword, email);

	const user = await User.findOne({ email: email });
	console.log(user);
	const match = await comparePassword(actualPassword, user.password);
	console.log(match);

	if (match) {
		const hashedPassword = await hashPassword(newPassword);
		console.log(hashedPassword);
		const userUpdated = await User.findOneAndUpdate({ email: email }, { password: hashedPassword }, { new: true, useFindAndModify: false });
		console.log("ho updateearea");
		return res.status(200).json('operazione eseguita con successo');
	}

	res.status(400).json('la password inserita non è la password corretta');
})

app.post('/getUserByUserKey', async (req, res) => {
	const { nameChat } = req.body;
	console.log('nameChat', nameChat);
	const userList = new Set([]);

	const chat = await PrivateChat.findOne({ chatName: nameChat });
	console.log('chat', chat);

	for (const ithUserKey of chat.userKey) {
		console.log('userKey', ithUserKey);
		const user = await User.findOne({ userKey: ithUserKey });
		const googleUser = await GoogleUser.findOne({ userKey: ithUserKey })
		console.log('user', user);
		userList.add(user === null ? googleUser : user);
	}

	console.log('userList', userList);

	const arrayConverted = Array.from(userList);
	console.log('arrayConverted', arrayConverted);

	res.status(200).json(arrayConverted);
})

app.post('/getActualUser', async (req, res) => {
	console.log(req.body);
	const { email } = req.body;
	console.log(email);
	const user = await User.find({ email: email });
	console.log('user', user);
	res.status(200).json(user);
})

app.post('/updateImagePic', async (req, res) => {
	console.log("pre", req.body);
	const { photoUrl, email } = req.body;

	console.log("post", photoUrl, email);

	// è qui sotto il problema, find ritorna query e non oggetto aggiornato
	const userUpdated = await User.findOneAndUpdate({ email: email }, { photoUrl: photoUrl }, { new: true, useFindAndModify: false });

	res.status(200).json(userUpdated);
})

app.post('/getTeamByTeamName', async (req, res) => {
	const { searchValue } = req.body;

	const team = await PokemonTeam.find({
		nameTeam: searchValue,
	})

	console.log('team', team);

	if (team) {
		return res.status(200).json(team);
	}
	res.status(500).json('non ci sono team a te associati, creane uno');
});

app.post('/register', async (req, res) => {
	console.log('sono entrato');
	const { name, username, email, password, userKey } = req.body;

	// if (isNil(name) && isNil(email) && isNil(password)) {
	// 	return res.json({
	// 		error: 'name,email e password sono obbligatori'
	// 	})
	// }

	// console.log(isNil(name) && isNil(email) && isNil(password));

	const exist = await User.findOne({ email: email })

	console.log(exist);

	if (exist) {
		return res.json({
			error: 'Email is taken already'
		})
	}

	const hashedPassword = await hashPassword(password);

	console.log(userKey);

	const user = await User.create({
		name,
		username,
		email,
		password: hashedPassword,
		userKey: userKey
	})

	console.log(user);

	return res.json(user);
})

app.post('/login', async (req, res) => {
	console.log("sono entrato");
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	console.log(user);

	if (!user) {
		return res.json({
			error: 'No user found'
		})
	}

	const match = await comparePassword(password, user.password);

	console.log(match);

	if (match) {
		res.json(user);
	}
})

app.post('/saveGoogleUser', async (req, res) => {
	console.log("sono entrato");
	const { name, surname, email, photo, userKey } = req.body;

	console.log(name, surname, email, photo, userKey);

	const user = await GoogleUser.findOne({ email });

	console.log(user);

	if (user) {
		return res.status(409).json({ message: 'Google User already exists' });
	}

	const googleUser = await GoogleUser.create({
		name,
		surname,
		email,
		photo,
		userKey: userKey
	})

	res.status(201).json({ message: 'User registered successfully' });
})

app.post('/createPrivateChat', async (req, res) => {
	const { selectedUser, actualEmail } = req.body;
	console.log(selectedUser, actualEmail);
	const userKey = new Set([]);
	const userMessage = [];
	const userToDisplay = [];

	const user = await User.findOneAndUpdate({ email: actualEmail }, { isOnline: true }, { new: true, useFindAndModify: false });
	if (user === null) {
		const googleUser = await GoogleUserModel.findOneAndUpdate({ email: actualEmail }, { isOnline: true }, { new: true, useFindAndModify: false });
	}

	for (const ithUser of selectedUser) {
		console.log(ithUser);
		const user = await User.findOne({ email: ithUser });
		const googleUser = await GoogleUserModel.findOne({ email: ithUser });

		console.log(user);
		console.log(googleUser);
		user !== null ? userKey.add(user.userKey) : userKey.add(googleUser.userKey);
		user !== null ? userToDisplay.push(user) : userToDisplay.push(googleUser);
	}

	const userKeyConverted = Array.from(userKey);

	const privateChat = PrivateChat.create({
		userKey: userKeyConverted,
		chatMessage: userMessage,
		chatName: "chat di prova2"
	});
	res.status(200).json(userToDisplay);
});

app.post('/getAllPrivateChat', async (req, res) => {
	const { email } = req.body;
	const privateChatVerified = new Set([]);
	// let googleUser = null;

	console.log("email", email);

	const user = await User.findOneAndUpdate({ email: email }, { isOnline: true }, { new: true, useFindAndModify: false });
	const googleUser = await GoogleUserModel.findOneAndUpdate({ email: email }, { isOnline: true }, { new: true, useFindAndModify: false });
	console.log("user", user);
	console.log("google", googleUser);
	// if(user === null) {
	// 	googleUser = await GoogleUserModel.findOneAndUpdate({ email: email },{isOnline: true}, { new: true, useFindAndModify: false});
	// } CAPIRE SE VABBENE ANCHE SENZA

	const privateChat = await PrivateChat.find({});

	for (const ithPrivateChat of privateChat) {
		ithPrivateChat.userKey.map((ithKey) => {
			if (user !== null) {
				console.log("sono entrato nella prima opzione");
				if (ithKey === user.userKey) {
					return privateChatVerified.add(ithPrivateChat);
				}
			} else {
				console.log("sono entrato nella seconda opzione");
				console.log("ithKey", ithKey);
				console.log("googleUserTrue", googleUser);
				console.log("user", user);
				console.log("googleUser", googleUser.userKey);
				console.log("isEqual", ithKey === googleUser.userKey);
				if (ithKey === googleUser.userKey) {
					return privateChatVerified.add(ithPrivateChat);
				}
			}
		});
	}

	console.log('privateChatVerified', privateChatVerified);

	const privateChatArray = Array.from(privateChatVerified);
	console.log('privateChatArray', privateChatArray);

	res.status(200).json(privateChatArray);
});

app.get('/getAllUser', async (req, res) => {
	const loginUser = await User.find({});
	const googleUser = await GoogleUserModel.find({});
	const chatRoomUsers = loginUser.concat(googleUser);
	console.log(loginUser);
	console.log(googleUser)
	console.log("chatRoomUser", chatRoomUsers);
	res.status(200).json(chatRoomUsers);
})

const CHAT_BOT = 'ChatBot';
let chatRoom = '';

function getCurrentTime() {
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
};

io.on("connection", (socket) => {
	console.log("User connected", socket.id);

	socket.on('userLeave', async (data) => {
		console.log('sono entrato aaaaa', data);
		const user = await User.findOneAndUpdate(
			{ email: data.email },
			{ isOnline: false },
			{ new: true, useFindAndModify: false }
		);
		if (user === null) {
			console.log("non trovato user, cerco google user");
			await GoogleUserModel.findOneAndUpdate(
				{ email: data.email },
				{ isOnline: false },
				{ new: true, useFindAndModify: false }
			);
		};
	})

	socket.on('retrieveAllUser', async (data) => {
		const loginUser = await User.find({});
		const googleUser = await GoogleUserModel.find({});
		const chatRoomUsers = loginUser.concat(googleUser);
		socket.to(data.room).emit('chatroom_users', chatRoomUsers);
		socket.emit('chatroom_users', chatRoomUsers);
	})

	socket.on('join_room', async (data) => {
		const { username, room, email } = data; // Data sent from client when join_room event emitted
		console.log(username, room, email);

		socket.join(room); // Join the user to a socket room
		socket.emit('fetch_message');

		let __createdTime__ = getCurrentTime();
		socket.to(room).emit('receive_message', {
			message: `${username} has joined the chat room`,
			username: CHAT_BOT,
			__createdTime__: __createdTime__
		});
		socket.emit('receive_message', {
			message: `Welcome ${username}`,
			username: CHAT_BOT,
			__createdTime__: __createdTime__
		})

		socket.on('fetch_message', async (data) => {
			console.log(room);
			const messageArray = await Message.find({ "room": room });
			console.log(messageArray);
			socket.emit('receive_multi_message', messageArray);
		})

		chatRoom = room;
		const user = await User.findOneAndUpdate(
			{ email: email },
			{ isOnline: true },
			{ new: true, useFindAndModify: false }
		);
		if (user === null) {
			console.log("non trovato null");
			await GoogleUserModel.findOneAndUpdate(
				{ email: email },
				{ isOnline: true },
				{ new: true, useFindAndModify: false }
			);
		};
		const loginUser = await User.find({});
		const googleUser = await GoogleUserModel.find({});
		const chatRoomUsers = loginUser.concat(googleUser);
		socket.to(room).emit('chatroom_users', chatRoomUsers);
		socket.emit('chatroom_users', chatRoomUsers);
	});

	socket.on('send_message', async (data) => {
		const { message, username, room, __createdtime__ } = data;

		const nuovoMessaggio = new Message({
			message: message,
			username: username,
			room: room,
			__createdtime__: __createdtime__
		});

		// io.in(room).emit('receive_message', {
		//     message: message,
		//     username: username,
		//     room: room,
		//     __createdtime__: __createdtime__
		// });
		io.in(room).emit('receive_message', nuovoMessaggio);
		const messageModel = await Message.create(data);
		console.log(messageModel);
	});

	socket.on('join_private_room', async (data) => {
		const { privateChat, email } = data; // Data sent from client when join_room event emitted
		console.log(privateChat, email);

		socket.join(privateChat); // Join the user to a socket room
		socket.emit('fetch_message');

		socket.on('fetch_message', async (data) => {
			console.log(PrivateChat);
			const messageArray = await PrivateChat.findOne({ "chatName": privateChat });
			console.log(messageArray);
			socket.emit('receive_multi_message', messageArray.chatMessage);
		})

		chatRoom = PrivateChat;
		const user = await User.findOneAndUpdate(
			{ email: email },
			{ isOnline: true },
			{ new: true, useFindAndModify: false }
		);
		if (user === null) {
			console.log("non trovato null");
			await GoogleUserModel.findOneAndUpdate(
				{ email: email },
				{ isOnline: true },
				{ new: true, useFindAndModify: false }
			);
		};

		/* cambiare meccanismo chatroom_user */
		const actualPrivateChat = await PrivateChat.findOne({ "chatName": privateChat });
		const chatRoomUsers = actualPrivateChat.userKey.map(async (ithKey) => {
			const user = await User.find({ 'key': ithKey });
			return user;
		});
		socket.to(privateChat).emit('chatroom_users', chatRoomUsers);
		socket.emit('chatroom_users', chatRoomUsers);
	});

	/* sendMessage private deve fare l update dell array messagge in private chat e settarsi lo stesso oggetto come message nel db */
})

server.listen(3000, () => {
	console.log("Listening on port 3000");
});



