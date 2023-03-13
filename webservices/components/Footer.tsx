import {Box, Text} from '@primer/react'

const Footer = () => {
  return (
    <Box sx={{borderTopWidth: 1, borderTopStyle: 'solid', borderColor: 'border.default', pb: 3}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3}}>
        <Text fontSize={0} color="text.secondary">&copy; Essential-studio {new Date().getFullYear()}</Text>
      </Box>
    </Box>
  )
}
export default Footer
