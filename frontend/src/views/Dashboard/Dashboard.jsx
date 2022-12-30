import React, { useState } from "react";
import { useEffect } from "react";
import "./Dashboard.scss";
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
  Avatar,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";

const Dashboard = () => {
  const [forename, setForename] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState(18);
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [nativeLang, setNativeLang] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userData, setUserData] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [avatarStyle, setAvatarStyle] = useState(
    "margin-left: auto; opacity: 100%;"
  );
  const [avatarHovered, setAvatarHovered] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const editProfile = () => {
    const formData = new FormData();
    formData.append("forename", forename);
    formData.append("surname", surname);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("nativeLang", nativeLang);
    formData.append("targetLang", targetLang);
    formData.append("profileImage", profileImage);
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);

    fetch(`http://localhost:5000/users/${userData.username}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (username !== userData.username) {
          sessionStorage.removeItem("token");
          window.location.replace("/login");
        } else {
          window.location.reload();
        }
      });
  };

  const hiddenFileInput = React.useRef(null);
  const uploadFile = (event) => {
    hiddenFileInput.current.click();
  };

  const closeModal = () => {
    setForename(userData.forename);
    setSurname(userData.surname);
    setAge(userData.age);
    setGender(userData.gender);
    setEmail(userData.email);
    setUsername(userData.username);
    setNativeLang(userData.nativeLang);
    setTargetLang(userData.targetLang);
    setOldPassword("");
    setNewPassword("");

    onClose();
  };

  useEffect(() => {
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

        setForename(data.data.forename);
        setSurname(data.data.surname);
        setAge(data.data.age);
        setGender(data.data.gender);
        setEmail(data.data.email);
        setUsername(data.data.username);
        setNativeLang(data.data.nativeLang);
        setTargetLang(data.data.targetLang);
      });
  }, []);

  const hoverAvatarEnter = () => {
    setAvatarStyle(
      "margin-left: auto; -webkit-filter: brightness(75%); cursor: pointer;"
    );
    setAvatarHovered(true);
  };

  const hoverAvatarLeave = () => {
    setAvatarStyle("margin-left: auto; opacity: 100%");
    setAvatarHovered(false);
  };

  const deleteAccountHandler = () => {
    fetch(`http://localhost:5000/users/${userData.username}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        sessionStorage.removeItem("token");
        window.location.replace("/home");
      });
  };

  return (
    <Grid
      h="90vh"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(2, 1fr)"
      background="gray.500"
    >
      <GridItem rowSpan={2} colSpan={1} p={14}>
        <Card background="white" size="lg">
          <CardHeader>
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Heading size="xl"> User Information</Heading>

              <Avatar
                Style={avatarStyle}
                onMouseEnter={() => hoverAvatarEnter()}
                onMouseLeave={() => hoverAvatarLeave()}
                size="2xl"
                src={`http://localhost:5000/${userData.username}_profile_image.jpg`}
                onClick={() => onOpen()}
              />
              {avatarHovered ? (
                <Icon
                  onMouseEnter={() => hoverAvatarEnter()}
                  onMouseLeave={() => hoverAvatarLeave()}
                  as={AiFillEdit}
                  boxSize={14}
                  fill="white"
                  style={{
                    position: "relative",
                    right: "6.75em",
                    opacity: 100,
                    zIndex: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => onOpen()}
                />
              ) : (
                <Icon
                  as={AiFillEdit}
                  boxSize={14}
                  fill="white"
                  style={{
                    position: "relative",
                    right: "6.75em",
                    opacity: 0,
                    zIndex: 1,
                    cursor: "pointer",
                  }}
                />
              )}
              <Modal isOpen={isOpen} onClose={() => closeModal()}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Edit Profile</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text mb="8px">Forename</Text>
                    <Input
                      value={forename}
                      onChange={(e) => setForename(e.target.value)}
                      mb={5}
                      placeholder="Forename"
                    />
                    <Text mb="8px">Surname</Text>
                    <Input
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      mb={5}
                      placeholder="Surname"
                    />
                    <HStack mb={5}>
                      <Text>Age</Text>
                      <NumberInput
                        maxW={20}
                        mb={5}
                        step={1}
                        defaultValue={userData.age}
                        min={1}
                        max={100}
                        allowMouseWheel
                        onChange={setAge}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text>Gender</Text>
                      <Select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        mb={5}
                        placeholder="Select a Gender"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </Select>
                    </HStack>
                    <Text mb="8px">Email Address</Text>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      mb={5}
                      type="email"
                      placeholder="Email address"
                    />
                    <Text mb="8px">Username</Text>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      mb={5}
                      placeholder="Username"
                    />
                    <Input
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      mb={5}
                      type={"password"}
                      placeholder="Old Password"
                    />
                    <Input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      mb={5}
                      type={"password"}
                      placeholder="New Password"
                    />
                    <Text mb="8px">Native Language</Text>
                    <Select
                      value={nativeLang}
                      onChange={(e) => setNativeLang(e.target.value)}
                      mb={10}
                    >
                      <option>Japanese</option>
                      <option>English</option>
                      <option>Spanish</option>
                    </Select>
                    <Text mb="8px">Target Language</Text>
                    <Select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      mb={10}
                    >
                      <option>Japanese</option>
                      <option>English</option>
                      <option>Spanish</option>
                    </Select>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                      <Button
                        type="submit"
                        colorScheme="blue"
                        onClick={uploadFile}
                      >
                        Change Profile Picture
                      </Button>
                      <input
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        mb={5}
                        type="file"
                        ref={hiddenFileInput}
                        style={{ display: "none" }}
                      />
                      <Text>{profileImage?.name}</Text>
                    </Flex>
                    <br />
                    <Text mb="8px">
                      Type 'DELETE' in the field if you would like to delete
                      your account
                    </Text>
                    <Input
                      value={deleteValue}
                      onChange={(e) => setDeleteValue(e.target.value)}
                      mb={5}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={() => closeModal()}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="ghost"
                      mr={3}
                      onClick={() => editProfile()}
                    >
                      Confirm Changes
                    </Button>
                    <Tooltip
                      hasArrow
                      label="Your account will be deleted forever!"
                      bg="red.600"
                      display={deleteValue === "DELETE" ? "" : "none"}
                    >
                      <Button
                        colorScheme="red"
                        onClick={() => deleteAccountHandler()}
                        disabled={deleteValue === "DELETE" ? false : true}
                      >
                        Delete Account
                      </Button>
                    </Tooltip>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text fontSize="2xl">Forename: {userData.forename}</Text>
            <br />
            <Text fontSize="2xl">Surname: {userData.surname}</Text>
            <br />
            <Text fontSize="2xl">Age: {userData.age}</Text>
            <br />
            <Text fontSize="2xl">Gender: {userData.gender}</Text>
            <br />
            <Text fontSize="2xl">Email: {userData.email}</Text>
            <br />
            <Text fontSize="2xl">Username: {userData.username}</Text>
            <br />
            <Text fontSize="2xl">Native Language: {userData.nativeLang}</Text>
            <br />
            <Text fontSize="2xl">Target Language: {userData.targetLang}</Text>
            <br />
            <Text fontSize="2xl">User Since: {userData.signupdate}</Text>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem colSpan={1} p={14}>
        <Card background="white" size="lg">
          <CardHeader>
            <Heading size="xl"> Filters</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="2xl">
              Matching you with native {userData.targetLang} speakers
            </Text>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex p={14} justifyContent="center" alignItems="center">
          <Button
            type="submit"
            onClick={() => window.location.replace("/chat")}
            colorScheme="blue"
            size="lg"
          >
            Start Chatting
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
