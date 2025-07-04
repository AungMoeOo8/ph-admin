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
import { NavLink, Outlet } from "react-router";
import { LuImages, LuLibrary, LuList, LuMenu, LuUsers } from "react-icons/lu";
// import { logout } from "@/features/supabase/auth.service";
import { ErrorBoundary } from "react-error-boundary";
import { useAuth } from "@/hooks/auth";

const navLinks = [
  { name: "People", to: "/dashboard/people", icon: LuUsers },
  { name: "Service", to: "/dashboard/service", icon: LuList },
  { name: "Course", to: "/dashboard/course", icon: LuLibrary },
  { name: "Activity", to: "/dashboard/activity", icon: LuImages },
];

export default function DashboardLayout() {
  const { logout } = useAuth();

  async function handleLogout() {
    logout();
  }

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
          <Button onClick={handleLogout}>Logout</Button>
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
            {navLinks.map((link, index) => (
              <NavLink key={index} to={link.to}>
                {({ isActive }) => (
                  <Box
                    p={3}
                    display={"flex"}
                    alignItems={"center"}
                    gapX={4}
                    rounded={"md"}
                    _hover={isActive ? undefined : { bg: "bg.muted" }}
                    color={isActive ? "white" : "black"}
                    bg={isActive ? "gray.solid" : "white"}
                  >
                    {link.icon({ size: 18 })}
                    {link.name}
                  </Box>
                )}
              </NavLink>
            ))}
          </Box>
        </Box>
        <Box mr={{ base: "", lg: 4 }} p={4} w={"full"}>
          <ErrorBoundary fallback={<div>Page Error</div>}>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Container>

      <DrawerContent borderRadius={"lg"}>
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
