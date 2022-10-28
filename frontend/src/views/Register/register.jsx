import React, { useState } from "react";
import "./register.scss";
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

const Register = () => {
  const [forename, setForename] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState(18);
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [targetLang, setTargetLang] = useState("");

  const formValues = {
    forename: forename,
    surname: surname,
    age: age,
    gender: gender,
    email: email,
    username: username,
    password: passConfirm,
    targetlang: targetLang,
  };

  const signUp = () => {
    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    }).then((res) => {
      console.log(res, formValues);
    });
  };

  return (
    <Flex
      height="100vh"
      justifyContent="center"
      alignItems="center"
      background="gray.500"
    >
      <Flex
        direction="column"
        p={10}
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
        <Button type="submit" onClick={() => signUp()} colorScheme="blue">
          Register
        </Button>
      </Flex>
    </Flex>
  );
};

export default Register;
