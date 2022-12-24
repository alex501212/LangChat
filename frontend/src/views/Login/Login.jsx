import React, { useState } from "react";
import "./Login.scss";
import { Flex, Input, Heading, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          window.sessionStorage.setItem("token", data.token);
          navigate("/dashboard");
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

        <Button type="submit" onClick={() => signIn()} colorScheme="blue">
          Login
        </Button>
      </Flex>
    </Flex>
  );
};

export default Login;
