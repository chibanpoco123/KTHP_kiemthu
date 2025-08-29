import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const LoginPrompt = ({ 
  title = "Bạn chưa đăng nhập!", 
  description = "Đăng nhập để có trải nghiệm tốt hơn và hoàn tất đơn hàng.",
  showSignup = true,
  variant = "info"
}) => {
  return (
    <Alert status={variant}>
      <AlertIcon />
      <VStack align="flex-start" spacing={3} flex={1}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        <HStack spacing={3}>
          <Button
            as={Link}
            to="/signin"
            colorScheme="blue"
            size="sm"
          >
            Đăng nhập
          </Button>
          {showSignup && (
            <Button
              as={Link}
              to="/signup"
              colorScheme="green"
              size="sm"
              variant="outline"
            >
              Đăng ký
            </Button>
          )}
        </HStack>
      </VStack>
    </Alert>
  );
};

export default LoginPrompt;
