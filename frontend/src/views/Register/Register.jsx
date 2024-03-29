import React, { useState } from "react";
import "./Register.scss";
import {
  Flex,
  Input,
  Heading,
  Select,
  Text,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import bg from "../../bg.png";

const Register = () => {
  const navigate = useNavigate();

  const [forename, setForename] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState(18);
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [nativeLang, setNativeLang] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [showPass, setShowPass] = useState(false);

  const toast = useToast();

  const register = () => {
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

    if (username.length < 4) {
      toast({
        description: "Username must be at least 4 characters long",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 8 && password !== "") {
      toast({
        description: "Your password must be 8 characters or more",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (
      (!password.match(/[a-z]/) || !password.match(/[A-Z]/)) &&
      password !== ""
    ) {
      toast({
        description:
          "Your password must contain uppercase and lowercase characters",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!password.match(/[0-9]/) && password !== "") {
      toast({
        description: "Your password must contain at least one number",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (passConfirm !== password && (password !== "" || passConfirm !== "")) {
      toast({
        description: "Passwords are not matching",
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

    if (
      forename !== "" &&
      surname !== "" &&
      gender !== "" &&
      email !== "" &&
      username !== "" &&
      password !== "" &&
      passConfirm !== "" &&
      nativeLang !== "" &&
      targetLang !== "" &&
      profileImage !== ""
    ) {
      const formData = new FormData();
      formData.append("forename", forename);
      formData.append("surname", surname);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", passConfirm);
      formData.append("nativeLang", nativeLang);
      formData.append("targetLang", targetLang);
      formData.append("profileImage", profileImage);

      fetch("http://localhost:5000/register", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "error") {
            toast({
              description: data.error,
              status: "error",
              duration: 2000,
              isClosable: true,
            });
          } else {
            navigate("/login");
          }
        });
    } else {
      toast({
        description: "Please fill in all fields",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const hiddenFileInput = React.useRef(null);
  const uploadFile = (event) => {
    hiddenFileInput.current.click();
  };

  const handleHideToggle = () => setShowPass(!showPass);

  return (
    <Flex
      boxShadow="inner"
      height="90vh"
      justifyContent="center"
      alignItems="center"
      style={{
        background: `url(${bg})`,
        backgroundSize: "1920px 940px",
        backgroundPosition: "0px -94px",
        backgroundColor: "#718096"
      }}
    >
      <Flex
        direction="column"
        p={5}
        borderWidth="5px"
        borderRadius="lg"
        background="white"
        boxShadow="dark-lg"
      >
        <Heading mb={10}>Sign up for LangChat</Heading>
        <Input
          value={forename}
          onChange={(e) => setForename(e.target.value)}
          mb={5}
          placeholder="Forename"
        />
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
            defaultValue={18}
            min={18}
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
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={5}
          type="email"
          placeholder="Email address"
        />
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          mb={5}
          placeholder="Username"
        />
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb={5}
            type={showPass ? "text" : "password"}
            placeholder="Password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleHideToggle}>
              {showPass ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Input
          value={passConfirm}
          onChange={(e) => setPassConfirm(e.target.value)}
          mb={5}
          type={"password"}
          placeholder="Confirm Password"
        />
        <Select
          value={nativeLang}
          onChange={(e) => setNativeLang(e.target.value)}
          mb={10}
          placeholder="What is your native language?"
        >
          <option>Japanese</option>
          <option>English</option>
          <option>Spanish</option>
        </Select>
        <Select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          mb={10}
          placeholder="What language are you learning?"
        >
          <option>Japanese</option>
          <option>English</option>
          <option>Spanish</option>
        </Select>
        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
          <Button type="submit" colorScheme="blue" onClick={uploadFile}>
            Upload Profile Picture
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
        <Button type="submit" onClick={() => register()} colorScheme="blue">
          Register
        </Button>
      </Flex>
    </Flex>
  );
};

export default Register;
