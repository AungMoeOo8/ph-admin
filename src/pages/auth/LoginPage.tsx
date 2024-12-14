import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Button, Center, Fieldset, Input } from "@chakra-ui/react";

export default function LoginPage() {
    return (
        <Center h={"dvh"} p={4}>
            <Fieldset.Root size={"lg"} maxW="320px">
                <Fieldset.Legend fontSize={"2xl"} fontWeight={"bold"}>PH Admin</Fieldset.Legend>
                <Fieldset.Content>
                    <Field label="Username">
                        <Input />
                    </Field>
                    <Field label="Password">
                        <PasswordInput/>
                    </Field>
                </Fieldset.Content>
                <Button>Login</Button>
            </Fieldset.Root>
        </Center>
    )
}