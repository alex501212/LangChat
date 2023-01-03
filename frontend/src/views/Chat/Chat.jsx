import React, { useEffect, useRef, useState } from "react";
import "./Chat.scss";
import io from "socket.io-client";
import Peer from "simple-peer";
import {
  Flex,
  Heading,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Grid,
  GridItem,
  Spinner,
  Avatar,
} from "@chakra-ui/react";

const socket = io.connect("http://localhost:5000");

const Chat = () => {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [userData, setUserData] = useState("");
  const [connectedUserData, setConnectedUserData] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // set media stream
    const getMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      } else {
        getMedia();
      }
    };
    getMedia();
  }, []);

  useEffect(() => {
    // intialize connection
    socket.on("me", (id, connections) => {
      fetch("http://localhost:5000/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: window.sessionStorage.getItem("token"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData(data.data);
          const account = {
            userName: data.data.username,
            clientId: id,
            nativeLang: data.data.nativeLang,
            targetLang: data.data.targetLang,
          };

          // add user to queue
          socket.emit("update", account);

          setMe(id);
        });
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  useEffect(() => {
    let isFound = false;
    let accs = [];
    socket.on("users", (acc) => {
      accs = acc;
    });

    if (!userData) return;
    function search(found) {
      if (found === false) {
        setTimeout(function () {
          socket.emit("randomId");
          // get random id to call
          let accs2 = [];
          for (let i = 0; i < accs.length; i++) {
            if (
              accs[i]["userName"] !== userData.username &&
              accs[i]["nativeLang"] === userData.targetLang &&
              typeof userData.username !== "undefined"
            ) {
              accs2.push(accs[i]);
            }
          }
          if (accs2.length > 0) {
            const randomId = accs2[Math.floor(Math.random() * accs2.length)];
            setIdToCall(randomId.clientId);
            found = true;

            fetch(`http://localhost:5000/profile/${randomId.userName}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                setConnectedUserData(data);
              });
            return;
          } else {
            search(found);
          }
        }, 2000);
      }
    }
    search(isFound);
  }, [userData]);

  useEffect(() => {
    if (!idToCall) return;
    callUser(idToCall);
  }, [idToCall]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  window.onerror = function (error) {
    if (error === "Uncaught ReferenceError: process is not defined") {
      setCallEnded(true);
    }
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  return (
    <Grid
      h="90vh"
      templateRows="repeat(4, 1fr)"
      templateColumns="repeat(3, 1fr)"
      background="gray.500"
    >
      <GridItem rowSpan={3} colSpan={2}>
        {callEnded ? (
          <Flex p={250} justifyContent="center" alignItems="center">
            <Heading size="lg" color="white">
              User Disconnected
            </Heading>
          </Flex>
        ) : callAccepted ? (
          <Flex p={2} justifyContent="center" alignItems="center">
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{ width: "800px" }}
            />
          </Flex>
        ) : receivingCall && !callAccepted ? (
          <Flex p={250} justifyContent="center" alignItems="center">
            <Button colorScheme="blue" onClick={answerCall} size="lg">
              Accept
            </Button>
          </Flex>
        ) : (
          <Flex p={250} justifyContent="center" alignItems="center">
            <Spinner
              p={10}
              thickness="10px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        )}
      </GridItem>
      <GridItem rowSpan={3} colSpan={1} p={10}>
        {callEnded ? (
          <Card background="white" size="lg">
            <CardHeader>
              <Heading size="lg">
                {connectedUserData?.username} left the call
              </Heading>
            </CardHeader>
            <CardBody>
              <Text fontSize="2xl">
                Forename: {connectedUserData?.forename}
              </Text>
              <br />
              <Text fontSize="2xl">Surname: {connectedUserData?.surname}</Text>
              <br />
              <Text fontSize="2xl">Age: {connectedUserData?.age}</Text>
              <br />
              <Text fontSize="2xl">Gender: {connectedUserData?.gender}</Text>
              <br />
              <Text fontSize="2xl">
                User Since: {connectedUserData?.signupdate}
              </Text>
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        ) : callAccepted ? (
          <Card background="white" size="lg">
            <CardHeader>
              <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                <Heading size="lg">{connectedUserData?.username}</Heading>

                <Avatar
                  Style="margin-left: auto"
                  size="2xl"
                  src={`http://localhost:5000/${connectedUserData?.username}_profile_image.jpg`}
                />
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="2xl">
                Forename: {connectedUserData?.forename}
              </Text>
              <br />
              <Text fontSize="2xl">Surname: {connectedUserData?.surname}</Text>
              <br />
              <Text fontSize="2xl">Age: {connectedUserData?.age}</Text>
              <br />
              <Text fontSize="2xl">Gender: {connectedUserData?.gender}</Text>
              <br />
              <Text fontSize="2xl">
                User Since: {connectedUserData?.signupdate}
              </Text>
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        ) : (
          <Card background="white" size="lg">
            <CardHeader>
              <Heading size="lg">Finding Users ...</Heading>
            </CardHeader>
            <CardBody>
              <Flex justifyContent="center" alignItems="center">
                <Spinner
                  p={10}
                  thickness="10px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Flex>
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        )}
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <Flex p={14} justifyContent="center" alignItems="center">
          {callAccepted && !callEnded ? (
            <Button
              colorScheme="blue"
              onClick={() => window.location.replace("/dashboard")}
              size="lg"
            >
              Back to Dashboard
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              onClick={() => window.location.replace("/dashboard")}
              size="lg"
            >
              Back to Dashboard
            </Button>
          )}
        </Flex>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <Flex justifyContent="center" alignItems="center">
          {stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{ width: "260px" }}
            />
          )}
        </Flex>
      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <Flex p={14} justifyContent="center" alignItems="center">
          {callAccepted || callEnded || receivingCall ? (
            <Button
              colorScheme="blue"
              onClick={() => window.location.replace("/chat")}
              size="lg"
            >
              Next
            </Button>
          ) : (
            <Button colorScheme="blue" isDisabled size="lg">
              Next
            </Button>
          )}
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Chat;
