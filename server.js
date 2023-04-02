const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routes = require("./routes/routes");
const cors = require("cors");
const cron = require("node-cron");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

dotenv.config();

mongoose.connect(process.env.DATABASE_CONNECTION, () =>
  console.log("DB connection established")
);

app.use(cors());
app.use(express.static("userProfileImages"));

const PORT = process.env.PORT || 5000;

let accs = [];

io.on("connection", (socket) => {
  let connections = Array.from(io.sockets.sockets).map((socket) => socket[0]);

  socket.emit("me", socket.id, connections);
  socket.on("disconnect", (soc) => {
    for (let i = 0; i < accs.length; i++) {
      if (accs[i]["clientId"] === socket.id) {
        accs.splice(i, 1);
      }
    }
    socket.broadcast.emit("callEnded");
  });

  socket.on("update", (account) => {
    for (let i = 0; i < accs.length; i++) {
      if (accs[i]["userName"] === account.userName) {
        accs.splice(i, 1);
      }
    }

    accs.push(account);
  });

  socket.on("callUser", (data) => {
    for (let i = 0; i < accs.length; i++) {
      if (accs[i]["clientId"] === data.from) {
        accs.splice(i, 1);
      }
    }
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("buttonAction", (caller) => {
    io.to(caller).emit("buttonAction");
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

app.use(express.json());
app.use(cors());
app.use("/", routes);
server.listen(PORT, () => console.log(`server is running on port ${PORT}`));

// scheduled to run every 15 seconds
cron.schedule("*/15 * * * * *", () => {
  if (accs.length > 1) {
    const matchedUsersUnique = new Set();
    // constantly try to match users
    const matchedSenders = [];
    const matchedRecievers = [];
    const matchedRecieverIds = [];

    for (let i = 0; i < accs.length; i++) {
      for (let x = 0; x < accs.length; x++) {
        if (
          accs[i]["userName"] !== accs[x]["userName"] &&
          accs[i]["nativeLang"] === accs[x]["targetLang"]
        ) {
          let iFilterCount = 0;
          let xFilterCount = 0;
          let totalFilters = 0; // filters that are both true in i and y
          let curr_i = accs[i]["filters"];
          let curr_x = accs[x]["filters"];
          for (let key in curr_i) {
            if (curr_i[key] === true) {
              iFilterCount++;
            }
            if (curr_x[key] === true) {
              xFilterCount++;
            }
            if (curr_i[key] === true && curr_x[key] === true) {
              totalFilters++;
            }
          }

          // if account i and x have more 0 matching filters
          if (
            totalFilters > 0 &&
            !matchedSenders.includes(accs[i]["clientId"]) &&
            !matchedRecievers.includes(accs[x]["userName"]) &&
            !matchedRecieverIds.includes(accs[x]["clientId"])
          ) {
            matchedUsersUnique.add({
              sender: accs[i]["clientId"],
              reciever: accs[x]["userName"],
              recieverId: accs[x]["clientId"],
            });
            matchedSenders.push(accs[i]["clientId"]);
            matchedRecievers.push(accs[x]["userName"]);
            matchedRecieverIds.push(accs[x]["clientId"]);
          } else if (
            // if accounts i or x have 0 filters selected
            totalFilters === 0 &&
            iFilterCount === 0 &&
            xFilterCount === 0 &&
            !matchedSenders.includes(accs[i]["clientId"]) &&
            !matchedRecievers.includes(accs[x]["userName"]) &&
            !matchedRecieverIds.includes(accs[x]["clientId"])
          ) {
            matchedUsersUnique.add({
              sender: accs[i]["clientId"],
              reciever: accs[x]["userName"],
              recieverId: accs[x]["clientId"],
            });
            matchedSenders.push(accs[i]["clientId"]);
            matchedRecievers.push(accs[x]["userName"]);
            matchedRecieverIds.push(accs[x]["clientId"]);
          }
        }
      }
    }
    matchedUsers = Array.from(matchedUsersUnique);

    if (matchedUsers.length > 1) {
      for (let i = 0; i < matchedUsers.length; i++) {
        io.to(matchedUsers[i]["sender"]).emit(
          "matchedUser",
          matchedUsers[i]["reciever"],
          matchedUsers[i]["recieverId"]
        );
      }
    }
  }
});
