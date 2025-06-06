import { ChakraProvider, Box, Heading, Container, useColorModeValue, HStack, Link as ChakraLink, Badge } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { StatusPage } from './pages/StatusPage';
import { theme } from './theme';

function Navigation() {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const linkActiveColor = useColorModeValue('blue.600', 'blue.300');
  const linkColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box 
      py={4} 
      px={4} 
      bg={bgColor} 
      boxShadow="sm" 
      position="sticky" 
      top={0} 
      zIndex={10}
      borderBottom="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container maxW="container.xl">
        <HStack spacing={8} justify="space-between" align="center">
          <HStack spacing={3}>
            <Heading 
              size="lg"
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
              letterSpacing="tight"
            >
              @incident-bot
            </Heading>
            <Badge colorScheme="green" variant="solid" fontSize="xs">
              Slack Integration
            </Badge>
          </HStack>
          
          <HStack spacing={6}>
            <ChakraLink
              as={Link}
              to="/"
              color={location.pathname === '/' ? linkActiveColor : linkColor}
              fontWeight={location.pathname === '/' ? 'semibold' : 'normal'}
              _hover={{ color: linkActiveColor }}
            >
              #incident-response
            </ChakraLink>
            <ChakraLink
              as={Link}
              to="/status"
              color={location.pathname === '/status' ? linkActiveColor : linkColor}
              fontWeight={location.pathname === '/status' ? 'semibold' : 'normal'}
              _hover={{ color: linkActiveColor }}
            >
              #status-page
            </ChakraLink>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}

function App() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg={bgColor}>
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/status" element={<StatusPage />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
