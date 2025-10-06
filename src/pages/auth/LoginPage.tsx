import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { fetchFactory } from "@/fetchFactory";
import { useAuth } from "@/hooks/auth";
import { Button, Center, Fieldset, Input } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { MiddlewareFunction, redirect } from "react-router";

export const loginMiddleware: MiddlewareFunction = async ({ request }) => {
  const token = fetchFactory.getToken()

  if (token) {
    const url = new URL(request.url);
    const from = url.searchParams.get("from") || "/dashboard";

    throw redirect(from);
  }

}

export default function LoginPage() {
  const { login } = useAuth();

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
      await login(username, password);
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
