import React, { useState } from "react";
import "./login.scss";
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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const formValues = {
    username: username,
    password: password,
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
        <Heading mb={10}>Log in to LangChat</Heading>
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

        <Button
          type="submit"
          onClick={() => console.log(formValues)}
          colorScheme="blue"
        >
          Login
        </Button>
      </Flex>
    </Flex>
  );
};

export default Login;
