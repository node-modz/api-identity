import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Text, Box, Button, FormControl, FormErrorMessage, FormLabel, Input, pseudoPropNames, InputGroup, InputRightElement } from '@chakra-ui/react'
import { Form, useFormikContext, Formik, useField, FieldInputProps, Field } from 'Formik'
import { InputHTMLAttributes, useState } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string,
  label: string,
}
export const InputField: React.FC<InputFieldProps> = (props: InputFieldProps) => {
  // inputProps now has all minus label & size i.e type, placeholder etc..
  const { label, size: _, ...inputProps } = props
  const [field, { error }] = useField(props.name)
  const { name, onBlur, onChange, value, checked, multiple } = field
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...inputProps} id={field.name}></Input>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}

export const PasswordField: React.FC<InputFieldProps> = (props: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { label, size: _, type, ...inputProps } = props
  const [field, { error }] = useField(props.name) 
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>      
      <InputGroup>
        <Input {...field} {...inputProps} id={field.name} type={showPassword ? 'text' : 'password'} />
        <InputRightElement h={'full'}>
          <Button
            variant={'ghost'}
            onClick={() =>
              setShowPassword((showPassword) => !showPassword)
            }>
            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}


