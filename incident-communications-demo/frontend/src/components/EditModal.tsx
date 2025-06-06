import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { incidentService } from '../services/incidentService';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDraft: string;
  onSave: (editedDraft: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  initialDraft,
  onSave,
}) => {
  const [editedDraft, setEditedDraft] = useState(initialDraft);
  const [isValidating, setIsValidating] = useState(false);
  const [localLeaks, setLocalLeaks] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    setEditedDraft(initialDraft);
  }, [initialDraft]);

  const validateDraft = async (text: string) => {
    try {
      setIsValidating(true);
      const response = await incidentService.redactLocal(text);
      setLocalLeaks(response.leaks);
    } catch (error) {
      console.error('Error validating draft:', error);
      toast({
        title: 'Validation Error',
        description: 'Could not validate the draft for sensitive information.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    if (localLeaks.length > 0) {
      toast({
        title: 'Cannot Save',
        description: 'Please remove sensitive information before saving.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    onSave(editedDraft);
    onClose();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEditedDraft(newText);
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateDraft(newText);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Status Draft</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Edit your status update. The system will automatically check for sensitive information.
            </Text>
            
            <Textarea
              value={editedDraft}
              onChange={handleTextChange}
              placeholder="Enter your status update..."
              rows={10}
              resize="vertical"
            />
            
            {localLeaks.length > 0 && (
              <VStack align="start" spacing={2} p={3} bg="red.50" borderRadius="md">
                <Text fontSize="sm" fontWeight="semibold" color="red.700">
                  ⚠️ Sensitive information detected:
                </Text>
                {localLeaks.map((leak, index) => (
                  <Text key={index} fontSize="sm" color="red.600">
                    • {leak}
                  </Text>
                ))}
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isDisabled={localLeaks.length > 0 || isValidating}
            isLoading={isValidating}
            loadingText="Validating..."
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 