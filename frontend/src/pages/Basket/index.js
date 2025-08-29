import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Image,
  AlertIcon,
  Button,
  Box,
  Text,
  HStack,
  VStack,
  Card,
  CardBody,
  Divider,
  Heading,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useBasket } from "../../contexts/BasketContext";
import { useAuth } from "../../contexts/AuthContext";
import LoginPrompt from "../../components/LoginPrompt";

function Basket() {
  const navigate = useNavigate();
  const { items, removeFromBasket } = useBasket();
  const { loggedIn } = useAuth();
  const total = items.reduce((acc, obj) => acc + obj.price, 0);

  const handleCheckout = () => {
    if (!loggedIn) {
      navigate('/signin');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <Box p="5">
      {items.length < 1 && (
        <Alert status="warning">
          <AlertIcon />
          You have not any items in your basket.
        </Alert>
      )}
      {items.length > 0 && (
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">
            Giỏ hàng của bạn
          </Heading>

          {/* Login Prompt for non-logged in users */}
          {!loggedIn && (
            <LoginPrompt 
              title="Bạn chưa đăng nhập!"
              description="Bạn có thể xem giỏ hàng và thêm sản phẩm. Để hoàn tất đơn hàng, vui lòng đăng nhập hoặc đăng ký tài khoản."
              showSignup={true}
              variant="info"
            />
          )}
          
          <HStack spacing={8} align="flex-start">
            {/* Product List */}
            <Box flex={2}>
              <VStack spacing={4} align="stretch">
                {items.map((item) => (
                  <Card key={item._id}>
                    <CardBody>
                      <HStack spacing={4}>
                        <Link to={`/product/${item._id}`}>
                          <Image
                            htmlWidth={100}
                            loading="lazy"
                            src={item.photos[0]}
                            alt="basket item"
                            boxSize={100}
                            objectFit="cover"
                            borderRadius="10px"
                          />
                        </Link>
                        <Box flex={1}>
                          <Link to={`/product/${item._id}`}>
                            <Text fontSize="18" fontWeight="bold">
                              {item.title}
                            </Text>
                          </Link>
                          <Text fontSize="16" color="blue.600" fontWeight="semibold">
                            ${item.price}
                          </Text>
                        </Box>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => removeFromBasket(item._id)}
                        >
                          Xóa
                        </Button>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </Box>

            {/* Order Summary */}
            <Box flex={1}>
              <Card>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="20" fontWeight="bold">
                      Tóm tắt đơn hàng
                    </Text>
                    <Divider />
                    <HStack justify="space-between">
                      <Text>Tạm tính:</Text>
                      <Text>${total}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Phí vận chuyển:</Text>
                      <Text color="green.500">Miễn phí</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text fontSize="18" fontWeight="bold">
                        Tổng cộng:
                      </Text>
                      <Text fontSize="18" fontWeight="bold" color="blue.600">
                        ${total}
                      </Text>
                    </HStack>
                    
                    <Button
                      onClick={handleCheckout}
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      mt={4}
                    >
                      {loggedIn ? 'Tiến hành thanh toán' : 'Đăng nhập để thanh toán'}
                    </Button>

                    {!loggedIn && (
                      <Button
                        as={Link}
                        to="/signup"
                        colorScheme="green"
                        size="md"
                        width="full"
                        variant="outline"
                      >
                        Chưa có tài khoản? Đăng ký ngay
                      </Button>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          </HStack>
        </VStack>
      )}
    </Box>
  );
}

export default Basket;