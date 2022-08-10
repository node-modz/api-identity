import React from 'react'
import { Box } from '@chakra-ui/react'

type WrapperProps = {
    variant?: "small" | "regular"
    children: React.ReactNode,
}
export const Wrapper: React.FC<WrapperProps> = (props) => {
    const {
      variant = "regular",
      children
    } = props
    return (
        <Box mt={8}
            mx="auto"
            maxW={variant === "regular" ? "800px" : "400px"}
            w="100%">
            {children}
        </Box>
    )
}