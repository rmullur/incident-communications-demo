import React, { useState } from 'react';
import {
  Box,
  Input,
  Text,
  Spinner,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

interface CommandBarProps {
  onCommand: (command: string, args: string[]) => void;
  isLoading?: boolean;
}

export const CommandBar: React.FC<CommandBarProps> = ({ onCommand, isLoading = false }) => {
  const [input, setInput] = useState('');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      const parts = input.trim().split(' ');
      if (parts.length >= 3 && parts[0].startsWith('/')) {
        const command = parts[0].substring(1); // Remove the '/'
        const subcommand = parts[1];
        const args = parts.slice(2);
        
        // For now, we only support /incident new [ID]
        if (command === 'incident' && subcommand === 'new' && args.length > 0) {
          onCommand('generate-draft', [args[0]]);
          setInput('');
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <Box w="100%" maxW="700px" mx="auto">
      <Box position="relative">
        <HStack
          spacing={3}
          p={4}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          bg={bgColor}
          shadow="sm"
          _focusWithin={{
            borderColor: 'blue.500',
            shadow: '0 0 0 1px #3182ce',
          }}
        >
          {isLoading ? (
            <Spinner size="sm" color="blue.500" />
          ) : (
            <Icon as={ChatIcon} color={placeholderColor} />
          )}
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Message #incident-response"
            variant="unstyled"
            fontSize="md"
            disabled={isLoading}
            _placeholder={{ color: placeholderColor }}
          />
        </HStack>
      </Box>
      
      <Box mt={3} px={2}>
        <HStack spacing={2} align="center" flexWrap="wrap">
          <Badge colorScheme="purple" variant="subtle" fontSize="xs">
            @incident-bot
          </Badge>
          <Text fontSize="sm" color={placeholderColor}>
            Try: <Text as="span" color="blue.500" fontFamily="mono">/incident new INC-123</Text>
          </Text>
        </HStack>
        <Text fontSize="xs" color={placeholderColor} mt={1}>
          🤖 AI-powered incident communications • Type slash commands to get started
        </Text>
      </Box>
    </Box>
  );
}; 