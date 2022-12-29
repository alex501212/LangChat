import React, { useEffect } from "react";
import "./Home.scss";
import { Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("token")
  }, []);

  return (
    <div>
      <Flex
        w="100vw"
        h="90vh"
        justifyContent="center"
        alignItems="center"
        bg="gray.500"
        p="7"
      >
        <ButtonGroup variant="outline" spacing="20" mb="10">
          <Button
            colorScheme="blue"
            variant="solid"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
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
