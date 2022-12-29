import React, { useState } from "react";
import { useEffect } from "react";
import "./Dashboard.scss";
import {
  Flex,
  Heading,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";

const Dashboard = () => {
  const [userData, setUserData] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/profile", {
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
        setUserData(data.data);
      });
  }, []);
  return (
    <Grid
      h="90vh"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(2, 1fr)"
      background="gray.500"
    >
      <GridItem rowSpan={2} colSpan={1} p={14}>
        <Card background="white" size="lg">
          <CardHeader>
            <Heading size="xl"> User Information</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="2xl">Forename: {userData.forename}</Text>
            <br />
            <Text fontSize="2xl">Surname: {userData.surname}</Text>
            <br />
            <Text fontSize="2xl">Age: {userData.age}</Text>
            <br />
            <Text fontSize="2xl">Gender: {userData.gender}</Text>
            <br />
            <Text fontSize="2xl">Email: {userData.email}</Text>
            <br />
            <Text fontSize="2xl">Username: {userData.username}</Text>
            <br />
            <Text fontSize="2xl">Native Language: {userData.nativeLang}</Text>
            <br />
            <Text fontSize="2xl">Target Language: {userData.targetLang}</Text>
            <br />
            <Text fontSize="2xl">User Since: {userData.signupdate}</Text>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      </GridItem>
      <GridItem colSpan={1} p={14}>
        <Card background="white" size="lg">
          <CardHeader>
            <Heading size="xl"> Filters</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="2xl">
              Matching you with native {userData.targetLang} speakers
            </Text>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex p={14} justifyContent="center" alignItems="center">
          <Button
            type="submit"
            onClick={() => window.location.replace("/chat")}
            colorScheme="blue"
            size="lg"
          >
            Start Chatting
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Dashboard;
