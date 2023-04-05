import React, { useState } from "react";
import "./Login.scss";
import { Flex, Input, Heading, Button, useToast } from "@chakra-ui/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const signIn = () => {
    if(username !== "") {
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
          sessionStorage.setItem("token", data.token);
          window.location.replace("/dashboard");
        } else {
          toast({
            description: data.message,
            status: "error",
            duration: 9000,
            isClosable: true,
            containerStyle: {
              width: "500px",
              maxWidth: "100%"
            },
          });
        }
      });
    } else {
      toast({
        description: "Invalid username or password",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              signIn();
            }
          }}
          mb={5}
          placeholder="Username"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              signIn();
            }
          }}
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
