import { Text, Box, Button, FormControl, FormErrorMessage, FormLabel, Input, pseudoPropNames } from '@chakra-ui/react'
import { Form, useFormikContext, Formik, useField, FieldInputProps, Field } from 'Formik'
import { InputHTMLAttributes } from 'react'

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



