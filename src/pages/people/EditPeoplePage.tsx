import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CloseButton } from "@/components/ui/close-button";
import { Field } from "@/components/ui/field";
import {
  FileInput,
  FileUploadClearTrigger,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { InputGroup } from "@/components/ui/input-group";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import { Tag } from "@/components/ui/tag";
import { toaster } from "@/components/ui/toaster";
import {
  PersonProps,
} from "@/features/wordpress/people.service";
import { updateFile } from "@/features/wordpress/upload.service";
import { useFileUpload } from "@/hooks/file-upload";
import { useGetPersonById, useUpdatePerson } from "@/hooks/people";
import {
  Box,
  createListCollection,
  Fieldset,
  Flex,
  For,
  Heading,
  Image,
  Input,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Textarea,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { LuFileUp } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";

const positons = createListCollection({
  items: [
    { label: "Professional", value: "PROFESSIONAL" },
    { label: "Member", value: "MEMBER" },
  ],
});

function EditPersonForm(person: PersonProps) {

  const navigate = useNavigate();

  const { register, handleSubmit, control, watch, getValues, setValue } =
    useForm<PersonProps>({
      values: { ...person, roles: person.roles ?? [] },
    });

  const [inputValue, setInputValue] = useState("");
  const [uploadImage, setUploadImage] = useState<File[]>([]);

  const updateFileMutation = useMutation({
    mutationFn: async ({
      filePath,
      file,
    }: {
      filePath: string;
      file: File;
    }) => {
      const response = await updateFile(filePath, "profile", file);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });

  const uploadFileMutation = useFileUpload("profile");

  const updatePersonMutation = useUpdatePerson()

  const savePerson: SubmitHandler<PersonProps> = async (person) => {
    // if (uploadImage.length > 0) {
    //   if (person.image != "") {
    //     await updateFileMutation.mutateAsync(
    //       { filePath: person.image, file: uploadImage[0] },
    //       {
    //         onSuccess(data) {
    //           person.image = data.url!;
    //         },
    //         onError: () => {
    //           toaster.create({
    //             type: "error",
    //             description: "Image updating failed.",
    //           });
    //         },
    //       }
    //     );
    //   } else {
    //     await uploadFileMutation.mutateAsync(uploadImage[0], {
    //       onSuccess: (data) => {
    //         person.image = data.url!;
    //       },
    //       onError: (error) => {
    //         toaster.create({
    //           type: "error",
    //           description: error.message,
    //         });
    //         return;
    //       },
    //     });
    //   }
    // }

    await updatePersonMutation.mutateAsync(person, {
      onSuccess: (data) => {
        toaster.create({
          type: "success",
          description: "Person updated.",
        });
        navigate("/dashboard/people", { replace: true });
      },
      onError: (error) => {
        toaster.create({
          type: "error",
          description: error.message,
        });
        return;
      },
    });
  };

  const addRole = () => {
    const roles = getValues("roles");
    if (inputValue.trim() && !roles.includes(inputValue.trim())) {
      const updatedRoles = [...roles, inputValue.trim()];
      setValue("roles", updatedRoles);
    }
    setInputValue("");
  };

  const removeRole = (role: string) => {
    const roles = getValues("roles").filter((r) => r !== role);
    setValue("roles", roles);
  };

  const previewImage = useMemo(() => {
    if (uploadImage.length > 0) {
      return URL.createObjectURL(uploadImage![0]);
    }
    return watch("image");
  }, [uploadImage, watch("image")]);



  return (
    <>
      <Fieldset.Root>
        <Heading size="2xl">Edit person</Heading>
        <Flex gap={4}>
          <Fieldset.Content>
            <Field label="Name">
              <Input {...register("name")} />
            </Field>

            <Field label="Position">
              <Controller
                control={control}
                name="position"
                render={({ field }) => (
                  <SelectRoot
                    name={field.name}
                    value={[field.value]}
                    collection={positons}
                    onValueChange={({ value }) => field.onChange(value[0])}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positons.items.map((postion) => (
                        <SelectItem
                          item={postion}
                          key={postion.value}
                          defaultChecked
                        >
                          {postion.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                )}
              />
            </Field>

            <Field label="Roles">
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <Box>
                    <For each={field.value}>
                      {(role, index) => (
                        <Tag
                          key={index}
                          size="lg"
                          colorScheme="blue"
                          borderRadius="full"
                          m={1}
                          closable
                          onClick={() => removeRole(role)}
                        >
                          {role}
                        </Tag>
                      )}
                    </For>
                  </Box>
                )}
              />
              <Input
                id="role-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRole();
                  }
                }}
              />
            </Field>

            <Field label="Order No.">
              <NumberInputRoot>
                <NumberInputField {...register("indexNumber")} />
              </NumberInputRoot>
            </Field>

            <Controller
              control={control}
              name="visibility"
              render={({ field }) => (
                <Field>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={({ checked }) => field.onChange(checked)}
                  >
                    {field.value ? "Public" : "Private"}
                  </Checkbox>
                </Field>
              )}
            />
          </Fieldset.Content>

          <Fieldset.Content marginTop={0}>
            <Image
              src={previewImage}
              objectFit={"contain"}
              aspectRatio={"golden"}
            />
            <FileUploadRoot
              onFileChange={(e) => {
                if (e.acceptedFiles.length > 0)
                  return setUploadImage(e.acceptedFiles);

                return setUploadImage([]);
              }}
            >
              <InputGroup
                w="full"
                startElement={<LuFileUp />}
                endElement={
                  <FileUploadClearTrigger asChild>
                    <CloseButton
                      me="-1"
                      size="xs"
                      variant="plain"
                      focusVisibleRing="inside"
                      focusRingWidth="2px"
                      pointerEvents="auto"
                      color="fg.subtle"
                    />
                  </FileUploadClearTrigger>
                }
              >
                <FileInput />
              </InputGroup>
            </FileUploadRoot>
          </Fieldset.Content>
        </Flex>

        <Field label="Biography">
          <Textarea rows={5} {...register("biography")} />
        </Field>

        <Button onClick={handleSubmit(savePerson)}>Save changes</Button>
      </Fieldset.Root>
    </>
  );
}

export default function EditPeoplePage() {
  const { personId } = useParams();


  const { data: person, isLoading, error } = useGetPersonById(Number(personId))

  return <Box>
    {isLoading && <div>Loading...</div>}
    {error && <div>{error.message}</div>}
    {person && <EditPersonForm {...person} />}
  </Box>
}
