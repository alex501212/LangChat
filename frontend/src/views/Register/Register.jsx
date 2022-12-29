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
  FormLabel,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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

  const formValues = {
    forename: forename,
    surname: surname,
    age: age,
    gender: gender,
    email: email,
    username: username,
    password: passConfirm,
    nativeLang: nativeLang,
    targetLang: targetLang,
    profileImage: profileImage,
  };

  const register = () => {
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
        navigate("/login");
      });
  };

  const hiddenFileInput = React.useRef(null);
  const uploadFile = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <Flex
      height="90vh"
      justifyContent="center"
      alignItems="center"
      background="gray.500"
    >
      <Flex
        direction="column"
        p={5}
        borderWidth="5px"
        borderRadius="lg"
        background="white"
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
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={5}
          type={"password"}
          placeholder="Password"
        />
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
