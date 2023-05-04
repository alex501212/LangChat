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
  Stack,
  Checkbox,
  useToast,
  InputGroup,
  InputRightElement,
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
  const [filters, setFilters] = useState({});
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [userSinceDate, setUserSinceDate] = useState("");

  const toast = useToast();

  const filterHandler = (filter) => {
    if (filters[filter] === false) {
      filters[filter] = true;
    } else {
      filters[filter] = false;
    }
    submitFilters();
  };

  const submitFilters = () => {
    sessionStorage["filters"] = JSON.stringify(filters);
  };

  const fieldChanged =
    forename !== userData.forename ||
    surname !== userData.surname ||
    gender !== userData.gender ||
    age !== userData.age ||
    email !== userData.email ||
    username !== userData.username ||
    (oldPassword !== "" && newPassword !== "") ||
    nativeLang !== userData.nativeLang ||
    targetLang !== userData.targetLang ||
    profileImage !== "";

  const editProfile = () => {
    if (!forename.match(/^[A-Za-z]+$/) && forename !== "") {
      toast({
        description: "Forename must contain alphabetical characters only",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!surname.match(/^[A-Za-z]+$/) && surname !== "") {
      toast({
        description: "Surname must contain alphabetical characters only",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (gender === "") {
      toast({
        description: "Select a valid gender",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (
      !email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/) &&
      email !== ""
    ) {
      toast({
        description: "Enter a valid email address",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (oldPassword !== "" && newPassword !== "") {
      if (oldPassword === newPassword) {
        toast({
          description: "Passwords are not different",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      if (newPassword.length < 8 && newPassword !== "") {
        toast({
          description: "Your new password must be 8 characters or more",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      if (
        (!newPassword.match(/[a-z]/) || !newPassword.match(/[A-Z]/)) &&
        newPassword !== ""
      ) {
        toast({
          description:
            "Your new password must contain uppercase and lowercase characters",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      if (!newPassword.match(/[0-9]/) && newPassword !== "") {
        toast({
          description: "Your new password must contain at least one number",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
    }

    if (username.length < 4) {
      toast({
        description: "Username must be at least 4 characters long",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (nativeLang === "") {
      toast({
        description: "Please select a valid native language",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (targetLang === "") {
      toast({
        description: "Please select a valid target language",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (targetLang === nativeLang) {
      toast({
        description:
          "Your target language cannot be the same as your native language",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

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
    if (oldPassword !== "" && newPassword !== "") {
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
    }

    fetch(`https://langchat-api.onrender.com/users/${userData.username}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (username !== userData.username) {
          sessionStorage.removeItem("token");
          window.location.replace("/login");
        } else if (data.error) {
          toast({
            description: data.error,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
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
    setDeleteValue("");

    onClose();
  };

  useEffect(() => {
    const fitlersToLoad = JSON.parse(sessionStorage.getItem("filters")) || {
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
    };
    setFilters(fitlersToLoad);
    setFiltersLoaded(true);
  }, []);

  useEffect(() => {
    fetch("https://langchat-api.onrender.com/profile", {
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

        const userDataDate = new Date(data.data.signupdate);
        setUserSinceDate(userDataDate.toDateString());
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
    fetch(`https://langchat-api.onrender.com/users/${userData.username}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        sessionStorage.removeItem("token");
        window.location.replace("/home");
      });
  };

  const handleHideToggle = () => setShowPass(!showPass);

  return (
    <Grid
      boxShadow="inner"
      h="90vh"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(2, 1fr)"
      background="gray.500"
    >
      <GridItem rowSpan={2} colSpan={1} p={14}>
        <Card background="white" size="lg" boxShadow="dark-lg">
          <CardHeader>
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Heading size="xl"> User Information</Heading>

              <Avatar
                Style={avatarStyle}
                data-testid="edit-modal"
                onMouseEnter={() => hoverAvatarEnter()}
                onMouseLeave={() => hoverAvatarLeave()}
                size="2xl"
                src={`https://langchat-api.onrender.com/${userData.username}_profile_image.jpg`}
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
                    <InputGroup size="md">
                      <Input
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        mb={5}
                        type={showPass ? "text" : "password"}
                        placeholder="Old Password"
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={handleHideToggle}
                        >
                          {showPass ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
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
                      disabled={!fieldChanged}
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
            <Text fontSize="2xl">User Since: {userSinceDate}</Text>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem colSpan={1} p={14}>
        <Card background="white" size="lg" boxShadow="dark-lg">
          <CardHeader>
            <Heading size="xl"> Filters</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="xl">
              Matching you with native {userData.targetLang} speakers
            </Text>
            <br />
            <hr />
            <br />
            <Text fontSize="lg">Interests</Text>
            <Stack spacing={4} direction="row" align="center">
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["reading"]}
                  value="reading"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Reading
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["food"]}
                  value="food"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Food
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["music"]}
                  value="music"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Music
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["movies"]}
                  value="movies"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Movies
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["tv"]}
                  value="tv"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  TV
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["sports"]}
                  value="sports"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Sports
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["gym"]}
                  value="gym"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Gym
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["cats"]}
                  value="cats"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Cats
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["dogs"]}
                  value="dogs"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Dogs
                </Checkbox>
              )}
            </Stack>
            <Stack spacing={4} direction="row" align="center">
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["video games"]}
                  value="video games"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Video Games
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["travel"]}
                  value="travel"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Travel
                </Checkbox>
              )}
            </Stack>
            <br />
            <Text fontSize="lg">Gender</Text>
            <Stack spacing={4} direction="row" align="center">
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["male"]}
                  value="male"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Male
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["female"]}
                  value="female"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Female
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["other"]}
                  value="other"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  Other
                </Checkbox>
              )}
            </Stack>
            <br />
            <Text fontSize="lg">Age</Text>
            <Stack spacing={4} direction="row" align="center">
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["18-25"]}
                  value="18-25"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  18-25
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["25-30"]}
                  value="25-30"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  25-30
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["30-40"]}
                  value="30-40"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  30-40
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["40-60"]}
                  value="40-60"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  40-60
                </Checkbox>
              )}
              {filtersLoaded && (
                <Checkbox
                  defaultChecked={filters["60+"]}
                  value="60+"
                  onChange={(e) => filterHandler(e.target.value)}
                >
                  60+
                </Checkbox>
              )}
            </Stack>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex p={14} justifyContent="center" alignItems="center">
          <Button
            boxShadow="xl"
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
