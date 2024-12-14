import {
  Box,
  Button,
  Container,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Flex,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { Link, Outlet } from "react-router";
import { LuMenu } from "react-icons/lu";

export default function DashboardLayout() {
  return (
    <DrawerRoot placement={"start"}>
      <DrawerBackdrop />
      <Box
        position={"sticky"}
        top={0}
        bg={"bg"}
        zIndex={20}
        // borderBottomWidth={"thin"}
      >
        <Container as={Flex} py={4} justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <DrawerTrigger asChild>
              <IconButton mr={4} display={{ base: "flex", lg: "none" }}>
                <LuMenu />
              </IconButton>
            </DrawerTrigger>
            <Heading size={"2xl"} fontWeight={"bold"}>
              PH Admin
            </Heading>
          </Flex>
          <Button>Logout</Button>
        </Container>
      </Box>
      <Container px={0} as={Flex}>
        <Box
          flexBasis={280}
          p={2}
          display={{ base: "none", lg: "block" }}
          // borderRightWidth={"thin"}
        >
          <Box p={2} position={"sticky"} top={"80px"}>
            {["People", "Services", "Academy", "Activity"].map(
              (item, index) => (
                <Box
                  key={index}
                  p={3}
                  fontSize={"lg"}
                  fontWeight={"medium"}
                  display={"flex"}
                  rounded={"md"}
                  _hover={{ bg: "bg.muted" }}
                  asChild
                >
                  <Link to={"/admin/people"}>{item}</Link>
                </Box>
              )
            )}
          </Box>
        </Box>
        <Box p={4} w={"full"}>
          <Outlet />
        </Box>
      </Container>

      <DrawerContent rounded={"md"}>
        <DrawerCloseTrigger />
        <DrawerHeader>
          <DrawerTitle />
        </DrawerHeader>
        <DrawerBody>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </DrawerRoot>
  );
}
