import React, { useEffect } from "react";
import "./Home.scss";
import { Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import bg from "../../bg.png";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("token");
  }, []);

  return (
    <div>
      <Flex
        boxShadow="inner"
        w="100vw"
        h="90vh"
        justifyContent="center"
        alignItems="center"
        style={{
          background: `url(${bg})`,
          backgroundSize: "1920px 940px",
          backgroundPosition: "0px -94px",
          backgroundColor: "#718096",
        }}
        p="7"
      >
        <ButtonGroup variant="outline" spacing="20" mb="10">
          <Heading size="2xl" textColor={"white"}>
            Welcome to LangChat
          </Heading>
          <Button
            right={"40px"}
            boxShadow="xl"
            colorScheme="blue"
            variant="solid"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            right={"40px"}
            boxShadow="xl"
            colorScheme="blue"
            variant="solid"
            size="lg"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </ButtonGroup>
      </Flex>
    </div>
  );
};

export default Home;
