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
  };

  const register = () => {
    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          window.sessionStorage.setItem("token", data.token);
          navigate("/login");
        }
      });
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
        <FormLabel>What is your native language?</FormLabel>
        <Select
          value={nativeLang}
          onChange={(e) => setNativeLang(e.target.value)}
          mb={10}
          placeholder="Select a language"
        >
          <option>Japanese</option>
          <option>English</option>
          <option>Spanish</option>
        </Select>
        <FormLabel>What language are you learning?</FormLabel>
        <Select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          mb={10}
          placeholder="Select a language"
        >
          <option>Japanese</option>
          <option>English</option>
          <option>Spanish</option>
        </Select>
        <Button type="submit" onClick={() => register()} colorScheme="blue">
          Register
        </Button>
      </Flex>
    </Flex>
  );
};

export default Register;
