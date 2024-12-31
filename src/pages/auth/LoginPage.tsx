import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Button, Center, Fieldset, Input } from "@chakra-ui/react";
import { useReducer } from "react";

type CredentialProps = {
  email: string;
  password: string;
};

function credentialReducer(
  state: CredentialProps,
  action: { type: string; email: string; password: string }
) {
  switch (action.type) {
    case "email":
      return { email: action.email, password: state.password };
    case "password":
      return { email: state.email, password: action.password };
    default:
      return state;
  }
}

export default function LoginPage() {
  const [state, dispatch] = useReducer(credentialReducer, {
    email: "",
    password: "",
  });

  function HandleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "email",
      email: e.target.value,
      password: state.password,
    });
  }

  function HandlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "password",
      email: state.email,
      password: e.target.value,
    });
  }

  function handleLogin() {}

  return (
    <Center h={"dvh"} p={4}>
      <Fieldset.Root size={"lg"} maxW="320px">
        <Fieldset.Legend fontSize={"2xl"} fontWeight={"bold"}>
          PH Admin
        </Fieldset.Legend>
        <Fieldset.Content>
          <Field label="Email">
            <Input onChange={HandleEmail} />
          </Field>
          <Field label="Password">
            <PasswordInput onChange={HandlePassword} />
          </Field>
        </Fieldset.Content>
        <Button onClick={handleLogin}>Login</Button>
      </Fieldset.Root>
    </Center>
  );
}
