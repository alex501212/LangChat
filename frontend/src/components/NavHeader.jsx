import React from "react";
import "./NavHeader.scss";
import { Heading, Flex } from "@chakra-ui/react";
import { Icon, Spacer, Button } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";

const NavHeader = () => {
  
  return (
    <Flex w="100vw" h="10vh" direction="row" bg="blue.500" p="7">
      <Heading as="h1" fontSize="30px" fontWeight="bold" mb="2" color="white">
        LangChat
      </Heading>
      <Spacer />
      <Button
        colorScheme="blue"
        variant="solid"
        size="lg"
        onClick={() => window.location.replace("/home")}
      >
        <Icon color="white" as={FaHome} w="9" h="9" />
      </Button>
      <Button
        colorScheme="blue"
        variant="solid"
        size="lg"
        onClick={() => window.location.replace("/home")}
      >
        <Icon color="white" as={RiLogoutBoxRLine} w="9" h="9" />Logout
      </Button>
    </Flex>
  );
};

export default NavHeader;
