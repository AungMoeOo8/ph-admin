import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/features/supabase/auth.service";
import { Button, Center, Fieldset, Input } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  async function handleLogin() {
    const response = await login(email, password);

    if (!response.isSuccess) {
      alert("login failed.");
    }

    navigate("/dashboard/", { replace: false });
  }

  return (
    <Center h={"dvh"} p={4}>
      <Fieldset.Root size={"lg"} maxW="320px">
        <Fieldset.Legend fontSize={"2xl"} fontWeight={"bold"}>
          PH Admin
        </Fieldset.Legend>
        <Fieldset.Content>
          <Field label="Email">
            <Input onChange={onEmailChange} />
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
