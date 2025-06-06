import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';

interface AgentStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  description: string;
  iconName: string;
  duration?: number;
}

interface AgentStatusModalProps {
  isProcessing: boolean;
  onStepUpdate?: (step: string) => void;
}

export const AgentStatusModal: React.FC<AgentStatusModalProps> = ({ 
  isProcessing, 
  onStepUpdate 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const [steps, setSteps] = useState<AgentStep[]>([
    {
      id: 'sourcing',
      name: 'Pulling Data from Sources',
      status: 'pending',
      description: 'Reading Slack history, PagerDuty, Grafana, Splunk, ServiceNow',
      iconName: '🔌',
    },
    {
      id: 'parsing',
      name: 'Parsing Incident Data',
      status: 'pending',
      description: 'Analyzing incident details and extracting key information',
      iconName: '🔍',
    },
    {
      id: 'drafting',
      name: 'Generating Draft',
      status: 'pending', 
      description: 'Using GPT-4o to create professional status update',
      iconName: '✍️',
    },
    {
      id: 'redacting',
      name: 'Security Scan',
      status: 'pending',
      description: 'Scanning for PII and sensitive information',
      iconName: '🛡️',
    },
    {
      id: 'formatting',
      name: 'Finalizing Output',
      status: 'pending',
      description: 'Formatting markdown and preparing for review',
      iconName: '✅',
    },
  ]);

  useEffect(() => {
    if (!isProcessing) {
      setSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
      return;
    }

    // Simulate the step progression
    const stepOrder = ['sourcing', 'parsing', 'drafting', 'redacting', 'formatting'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < stepOrder.length) {
        const stepId = stepOrder[currentIndex];
        
        setSteps(prev => prev.map(step => {
          if (step.id === stepId) {
            return { ...step, status: 'running' as const };
          } else if (stepOrder.indexOf(step.id) < currentIndex) {
            return { ...step, status: 'completed' as const };
          }
          return step;
        }));

        onStepUpdate?.(stepId);

        // Complete current step after 1.5 seconds and move to next
        setTimeout(() => {
          setSteps(prev => prev.map(step => {
            if (step.id === stepId) {
              return { ...step, status: 'completed' as const };
            }
            return step;
          }));
          currentIndex++;
        }, 1500);
      } else {
        clearInterval(interval);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isProcessing, onStepUpdate]);

  if (!isProcessing && !steps.some(s => s.status === 'completed')) {
    return (
      <Box
        position="fixed"
        top="120px"
        right="20px"
        width="320px"
        p={4}
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        shadow="lg"
        zIndex={1000}
      >
        <VStack spacing={3} align="stretch">
          <Text fontSize="sm" fontWeight="semibold" color={mutedColor}>
            🤖 LLM Agent Status
          </Text>
          <VStack spacing={2} align="stretch">
            <Text fontSize="sm" color={mutedColor}>
              Ready to process incident data. Try these demo commands:
            </Text>
            <VStack spacing={1} align="stretch" fontSize="xs" color={mutedColor} fontFamily="mono">
              <Text>/incident new INC-123</Text>
              <Text>/incident new INC-456</Text>
              <Text>/incident new INC-789</Text>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      position="fixed"
      top="120px"
      right="20px"
      width="320px"
      p={4}
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      shadow="lg"
      zIndex={1000}
    >
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="semibold" color={mutedColor}>
            🤖 LLM Agent Status
          </Text>
          {isProcessing && (
            <Badge colorScheme="blue" variant="subtle">
              Processing
            </Badge>
          )}
        </HStack>

        <VStack spacing={2} align="stretch">
          {steps.map((step) => (
            <HStack key={step.id} spacing={3} align="flex-start">
              <Box mt={0.5}>
                {step.status === 'running' ? (
                  <Spinner size="sm" color="blue.500" />
                ) : step.status === 'completed' ? (
                  <Text fontSize="sm">✅</Text>
                ) : (
                  <Text fontSize="sm" opacity={0.4}>{step.iconName}</Text>
                )}
              </Box>
              
              <VStack spacing={1} align="flex-start" flex={1}>
                <Text 
                  fontSize="xs" 
                  fontWeight="medium"
                  color={step.status === 'completed' ? 'green.600' : step.status === 'running' ? 'blue.600' : 'gray.500'}
                >
                  {step.name}
                </Text>
                <Text fontSize="xs" color={mutedColor} lineHeight="1.3">
                  {step.description}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>

        {!isProcessing && steps.some(s => s.status === 'completed') && (
          <Text fontSize="xs" color="green.600" textAlign="center" mt={2}>
            ✅ Draft ready for review
          </Text>
        )}
      </VStack>
    </Box>
  );
}; 