import {
  Checkbox,
  CheckboxGroup,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react';

export default function MainForm() {
  return (
    <Container maxW="container.md">
      <Heading as="h1" mb={4}>
        BetterSelf
      </Heading>
      <form>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input id="title" type="text" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="start-time">Start Time</FormLabel>
            <Input id="start-time" type="time" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="end-time">End Time</FormLabel>
            <Input id="end-time" type="time" />
          </FormControl>
          <FormControl>
            <FormLabel>Focus</FormLabel>
            <CheckboxGroup colorScheme="green" defaultValue={[]}>
              <Stack direction="row">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Checkbox key={value} value={value.toString()}>
                    {value}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Point</FormLabel>
            <CheckboxGroup colorScheme="blue" defaultValue={[]}>
              <Stack direction="row">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Checkbox key={value} value={value.toString()}>
                    {value}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="note">Note</FormLabel>
            <Textarea id="note" />
          </FormControl>
        </Stack>
      </form>
    </Container>
  );
}
