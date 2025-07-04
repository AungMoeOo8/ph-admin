import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { login as loginRequest } from "@/features/wordpress/auth.service";
import { useAuth } from "@/hooks/auth";
import { Button, Center, Fieldset, Input } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";

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
    const { data, isSuccess } = await loginRequest(username, password);

    if (!isSuccess) {
      return alert("login failed.");
    }

    login({
      id: data.id,
      email: data.email,
      name: data.name,
      token: data.token,
    });
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
