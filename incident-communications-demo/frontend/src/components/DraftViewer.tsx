import React from 'react';
import {
  Box,
  Text,
  VStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

interface DraftViewerProps {
  draft: string;
  latency?: number;
}

export const DraftViewer: React.FC<DraftViewerProps> = ({ draft, latency }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const contentBg = useColorModeValue('white', 'gray.900');

  if (!draft) {
    return (
      <Box
        p={6}
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        textAlign="center"
      >
        <Text color="gray.500" fontSize="md">
          No draft generated yet. Use the command bar above to create one.
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Box
        p={4}
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
      >
        <VStack spacing={3} align="stretch">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Text fontSize="lg" fontWeight="semibold">
              Generated Status Draft
            </Text>
            {latency && (
              <Badge colorScheme="blue" variant="subtle">
                {latency}ms
              </Badge>
            )}
          </Box>
          
          <Box
            p={4}
            bg={contentBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="md"
            fontSize="md"
            lineHeight="1.6"
            sx={{
              '& h1, & h2, & h3': { fontWeight: 'bold', marginBottom: 2 },
              '& h1': { fontSize: 'xl' },
              '& h2': { fontSize: 'lg' },
              '& h3': { fontSize: 'md' },
              '& p': { marginBottom: 3 },
              '& ul, & ol': { marginY: 2, paddingLeft: 4 },
              '& li': { marginY: 1 },
              '& strong': { fontWeight: 'bold' },
              '& em': { fontStyle: 'italic' },
              '& code': { 
                backgroundColor: useColorModeValue('gray.100', 'gray.700'),
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: 'sm',
                fontFamily: 'mono'
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'blue.300',
                paddingLeft: 4,
                marginY: 3,
                fontStyle: 'italic'
              }
            }}
          >
            <Box>
              {draft.split(/(<REDACTED[^>]*>)/).map((part, index) => {
                if (part.startsWith('<REDACTED')) {
                  return (
                    <Text
                      key={index}
                      as="span"
                      bg="red.100"
                      color="red.800"
                      px={2}
                      py={1}
                      borderRadius="sm"
                      fontSize="sm"
                      fontWeight="semibold"
                      display="inline-block"
                      margin="0 2px"
                    >
                      {part}
                    </Text>
                  );
                } else if (part.trim()) {
                  return (
                    <Box key={index} display="inline">
                      <ReactMarkdown>{part}</ReactMarkdown>
                    </Box>
                  );
                }
                return null;
              })}
            </Box>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
}; 