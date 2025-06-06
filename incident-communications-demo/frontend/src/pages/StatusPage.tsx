import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Card,
  CardBody,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { incidentService, StatusUpdate } from '../services/incidentService';

export const StatusPage: React.FC = () => {
  const [updates, setUpdates] = useState<StatusUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const updateContentBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    fetchStatusUpdates();
  }, []);

  const fetchStatusUpdates = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const data = await incidentService.getStatusUpdates();
      setUpdates(data);
      setError(null);
    } catch (err) {
      setError('Failed to load status updates');
      console.error('Error fetching status updates:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchStatusUpdates(true);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffMs = now.getTime() - updateTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="container.md" py={8}>
          <VStack spacing={6}>
            <Heading size="lg">System Status</Heading>
            <Spinner size="lg" color="blue.500" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="container.md" py={8}>
          <VStack spacing={6}>
            <Heading size="lg">System Status</Heading>
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
            <Button onClick={handleRefresh} leftIcon={<RepeatIcon />}>
              Try Again
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.md" py={8}>
        <VStack spacing={6}>
          <VStack spacing={2}>
            <Heading size="lg" textAlign="center">
              System Status
            </Heading>
            <Text color="gray.600" textAlign="center">
              Latest incident communications and status updates
            </Text>
          </VStack>

          <HStack spacing={4} justify="center">
            <Button
              leftIcon={<RepeatIcon />}
              onClick={handleRefresh}
              isLoading={isRefreshing}
              loadingText="Refreshing..."
              colorScheme="blue"
              variant="outline"
            >
              Refresh Updates
            </Button>
          </HStack>

          {updates.length === 0 ? (
            <Card bg={cardBg} w="100%">
              <CardBody>
                <VStack spacing={3} py={8}>
                  <Text fontSize="lg" fontWeight="medium">
                    No status updates yet
                  </Text>
                  <Text color="gray.600" textAlign="center">
                    Status updates will appear here once they are published.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <VStack spacing={4} w="100%">
              {updates.map((update, index) => (
                <Card key={index} bg={cardBg} w="100%" shadow="md">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Box display="flex" justifyContent="space-between" alignItems="start">
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.600">
                            {formatTimestamp(update.ts)}
                          </Text>
                          <Badge colorScheme="blue" variant="subtle">
                            {getTimeAgo(update.ts)}
                          </Badge>
                        </VStack>
                        <Badge colorScheme="green" variant="solid">
                          Published
                        </Badge>
                      </Box>
                      
                      <Box
                        p={4}
                        bg={updateContentBg}
                        borderRadius="md"
                        fontSize="md"
                        lineHeight="1.6"
                        whiteSpace="pre-wrap"
                      >
                        {update.draft}
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
}; 