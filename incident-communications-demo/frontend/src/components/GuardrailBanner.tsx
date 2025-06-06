import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  Text,
  Code,
  Box,
} from '@chakra-ui/react';

interface GuardrailBannerProps {
  leaks: string[];
}

export const GuardrailBanner: React.FC<GuardrailBannerProps> = ({ leaks }) => {
  if (!leaks || leaks.length === 0) {
    return null;
  }

  return (
    <Alert status="error" borderRadius="lg" p={4}>
      <AlertIcon />
      <Box flex="1">
        <AlertTitle mr={2}>
          Sensitive Information Detected!
        </AlertTitle>
        <AlertDescription>
          <VStack align="start" spacing={2} mt={2}>
            <Text>
              The following sensitive information was detected and must be reviewed before publishing:
            </Text>
            <VStack align="start" spacing={1} pl={4}>
              {leaks.map((leak, index) => (
                <Text key={index} fontSize="sm">
                  • <Code colorScheme="red" fontSize="sm">{leak}</Code>
                </Text>
              ))}
            </VStack>
            <Text fontSize="sm" color="red.600" fontWeight="medium">
              Publishing is disabled until these issues are resolved.
            </Text>
          </VStack>
        </AlertDescription>
      </Box>
    </Alert>
  );
}; 