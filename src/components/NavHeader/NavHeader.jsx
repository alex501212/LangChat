import React, { useState, useEffect } from "react";
import "./NavHeader.scss";
import { Heading, Flex } from "@chakra-ui/react";
import { Icon, Spacer, Button } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { RiLogoutBoxRLine, RiAdminFill } from "react-icons/ri";

const NavHeader = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    let token = sessionStorage.getItem("token");

    if (token) {
      setIsToken(true);
      fetch("https://langchat-api.onrender.com/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: window.sessionStorage.getItem("token"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsAdmin(data.data.username === "alex501212");
        });
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("token");
    window.location.replace("/home");
  };

  return (
    <Flex w="100vw" h="10vh" direction="row" bg="blue.500" p="7">
      <Heading as="h1" fontSize="30px" fontWeight="bold" mb="2" color="white">
        LangChat
      </Heading>
      <Spacer />
      {isAdmin && (
        <Button
          colorScheme="blue"
          variant="solid"
          size="lg"
          disabled={!isAdmin}
          onClick={() => window.location.replace("/admin")}
        >
          <Icon color="white" as={RiAdminFill} w="9" h="9" />
        </Button>
      )}
      <Button
        colorScheme="blue"
        variant="solid"
        size="lg"
        onClick={() => logout()}
      >
        <Icon color="white" as={FaHome} w="9" h="9" />
      </Button>

      {isToken && (
        <Button
          colorScheme="blue"
          variant="solid"
          size="lg"
          onClick={() => logout()}
        >
          <Icon color="white" as={RiLogoutBoxRLine} w="9" h="9" />
          Logout
        </Button>
      )}
    </Flex>
  );
};

export default NavHeader;
