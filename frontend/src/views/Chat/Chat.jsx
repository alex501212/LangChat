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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  useToast,
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reportMessage, setReportMessage] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [connectedUserSinceDate, setConnectedUserSinceDate] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const toast = useToast();

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
            filters: JSON.parse(sessionStorage.getItem("filters")) || {
              "reading": false,
              "food": false,
              "music": false,
              "movies": false,
              "tv": false,
              "sports": false,
              "gym": false,
              "cats": false,
              "dogs": false,
              "video games": false,
              "travel": false,
              "male": false,
              "female": false,
              "other": false,
              "18-25": false,
              "25-30": false,
              "30-40": false,
              "60+": false,
            },
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
    socket.on("matchedUser", (user, id) => {
      fetch(`http://localhost:5000/profile/${user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setIdToCall(id);
          setConnectedUserData(data);
          const userDataDate = new Date(data.signupdate);
          setConnectedUserSinceDate(userDataDate.toDateString());
        });
    });

    socket.on("buttonAction", () => {
      setCallEnded(true);
      setCallAccepted(true);
      setReceivingCall(false);
    });
  }, []);

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

  const nextActionHandler = () => {
    socket.emit("buttonAction", caller);
    window.location.replace("/chat");
  };

  const backActionHandler = () => {
    socket.emit("buttonAction", caller);
    window.location.replace("/dashboard");
  };

  const reportAccountHandler = () => {
    if (reportMessage === "" || reportMessage === undefined) {
      toast({
        description: "Please add a report message",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (reportReason === "" || reportReason === undefined) {
      toast({
        description: "Please add a report reason",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const formData = {
      message: reportMessage,
      reportedUser: connectedUserData?.username,
      reason: reportReason,
    };

    fetch("http://localhost:5000/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        onClose();
        setReportMessage();
        setReportReason();
        toast({
          title: "Report Recieved.",
          description: "Our admins will take a look at your report shortly.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const closeModalHandler = () => {
    onClose();
    setReportMessage();
    setReportReason();
  };

  return (
    <Grid
      boxShadow="inner"
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
            <Button boxShadow='xl' colorScheme="blue" onClick={answerCall} size="lg">
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
          <Card background="white" size="lg" boxShadow="dark-lg">
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
                User Since: {connectedUserSinceDate}
              </Text>
              <br />
              <Button colorScheme="red" size="md" onClick={() => onOpen()}>
                Report User
              </Button>
              <Modal isOpen={isOpen} onClose={() => closeModalHandler()}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Report User</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text mb="8px">Report Message</Text>
                    <Input
                      value={reportMessage}
                      onChange={(e) => setReportMessage(e.target.value)}
                      mb={5}
                      placeholder="Message"
                    />
                    <Text>Reason</Text>
                    <Select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      mb={5}
                      placeholder="What is the problem?"
                    >
                      <option>Violence or Gore</option>
                      <option>Bullying or Harassment</option>
                      <option>Hateful Conduct</option>
                      <option>Self-Harm</option>
                      <option>Nudity or Sexually Explicit</option>
                      <option>Spam, Scams, or Bots</option>
                      <option>Other</option>
                    </Select>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={() => closeModalHandler()}
                    >
                      Cancel
                    </Button>

                    <Button
                      colorScheme="red"
                      type="submit"
                      onClick={() => reportAccountHandler()}
                    >
                      Send Report
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </CardBody>
          </Card>
        ) : callAccepted || receivingCall ? (
          <Card background="white" size="lg" boxShadow="dark-lg">
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
                User Since: {connectedUserSinceDate}
              </Text>
              <br />
              <Button colorScheme="red" size="md" onClick={() => onOpen()}>
                Report User
              </Button>
              <Modal isOpen={isOpen} onClose={() => closeModalHandler()}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Report User</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text mb="8px">Report Message</Text>
                    <Input
                      value={reportMessage}
                      onChange={(e) => setReportMessage(e.target.value)}
                      mb={5}
                      placeholder="Message"
                    />
                    <Text>Reason</Text>
                    <Select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      mb={5}
                      placeholder="What is the problem?"
                    >
                      <option>Violence or Gore</option>
                      <option>Bullying or Harassment</option>
                      <option>Hateful Conduct</option>
                      <option>Self-Harm</option>
                      <option>Nudity or Sexually Explicit</option>
                      <option>Spam, Scams, or Bots</option>
                      <option>Other</option>
                    </Select>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={() => closeModalHandler()}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      colorScheme="red"
                      onClick={() => reportAccountHandler()}
                    >
                      Send Report
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </CardBody>
          </Card>
        ) : (
          <Card background="white" size="lg" boxShadow="dark-lg">
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
              boxShadow="xl"
              colorScheme="blue"
              onClick={() => backActionHandler()}
              size="lg"
            >
              Back to Dashboard
            </Button>
          ) : (
            <Button
              boxShadow="xl"
              colorScheme="blue"
              onClick={() => backActionHandler()}
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
              boxShadow="xl"
              colorScheme="blue"
              onClick={() => nextActionHandler()}
              size="lg"
            >
              Next
            </Button>
          ) : (
            <Button boxShadow="xl" colorScheme="blue" isDisabled size="lg">
              Next
            </Button>
          )}
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Chat;
