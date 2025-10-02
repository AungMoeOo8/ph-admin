import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { login as loginRequest } from "@/features/wordpress/auth.service";
import { useAuth } from "@/hooks/auth";
import { getUserFromStorage } from "@/util";
import { Button, Center, Fieldset, Input } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { LoaderFunction, redirect, useNavigate } from "react-router";

export const loginLoader: LoaderFunction = ({ request }) => {
  const user = getUserFromStorage();

  if (user) {
    // Check if we came from somewhere
    const url = new URL(request.url);
    const from = url.searchParams.get("from") || "/dashboard";

    throw redirect(from);
  }

  return null; // let the login page render
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function onUsernameChange(e: ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleLogin() {
    try {
      const user = await loginRequest(username, password);

      login(user);

      const to = new URL(location.href).searchParams.get("from") || "/dashboard/people"

      navigate(to, { replace: true });
    } catch {
      toaster.create({
        description: "Login failed."
      })
    }
  }

  return (
    <Center h={"dvh"} p={4}>
      <Fieldset.Root size={"lg"} maxW="320px">
        <Fieldset.Legend fontSize={"2xl"} fontWeight={"bold"}>
          PH Admin
        </Fieldset.Legend>
        <Fieldset.Content>
          <Field label="Username">
            <Input onChange={onUsernameChange} />
          </Field>
          <Field label="Password">
            <PasswordInput onChange={onPasswordChange} />
          </Field>
        </Fieldset.Content>
        <Button onClick={handleLogin}>Login</Button>
      </Fieldset.Root>
    </Center>
  );
}
