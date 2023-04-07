import React, { useState } from "react";
import "./Login.scss";
import {
  Flex,
  Input,
  Heading,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import bg from "../../bg.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const toast = useToast();

  const handleHideToggle = () => setShowPass(!showPass);

  const signIn = () => {
    if (username !== "") {
      fetch("https://langchat-api.onrender.com/login", {
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
              description: data.error,
              status: "error",
              duration: 9000,
              isClosable: true,
              containerStyle: {
                width: "500px",
                maxWidth: "100%",
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
        p={10}
        borderWidth="5px"
        borderRadius="lg"
        background="white"
        boxShadow="dark-lg"
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

        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                signIn();
              }
            }}
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


        <Button type="submit" onClick={() => signIn()} colorScheme="blue">
          Login
        </Button>
      </Flex>
    </Flex>
  );
};

export default Login;
