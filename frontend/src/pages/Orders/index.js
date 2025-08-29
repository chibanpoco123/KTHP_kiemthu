import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Image,
  Badge,
  Button,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { fetchOrders } from '../../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast({
          title: 'Lỗi tải đơn hàng',
          description: 'Không thể tải danh sách đơn hàng.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [toast]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'yellow';
      case 'Processing':
        return 'blue';
      case 'Shipped':
        return 'purple';
      case 'Delivered':
        return 'green';
      case 'Cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'green';
      case 'Pending':
        return 'yellow';
      case 'Failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center">
          <Spinner size="xl" />
          <Text mt={4}>Đang tải đơn hàng...</Text>
        </Box>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          <Heading size="lg" textAlign="center">
            Lịch sử đơn hàng
          </Heading>
          <Alert status="info">
            <AlertIcon />
            Bạn chưa có đơn hàng nào.
          </Alert>
          <Button as={Link} to="/" colorScheme="blue">
            Mua sắm ngay
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">
          Lịch sử đơn hàng
        </Heading>

        <VStack spacing={4} align="stretch">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {/* Order Header */}
                  <HStack justify="space-between" align="flex-start">
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Mã đơn hàng: {order._id}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Ngày đặt: {formatDate(order.createdAt)}
                      </Text>
                    </Box>
                    <VStack align="flex-end" spacing={2}>
                      <Badge colorScheme={getStatusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                      <Badge colorScheme={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </VStack>
                  </HStack>

                  <Divider />

                  {/* Customer Info */}
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Thông tin khách hàng:
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        <Text fontSize="sm">
                          <strong>Tên:</strong> {order.customerInfo.fullName}
                        </Text>
                        <Text fontSize="sm">
                          <strong>Email:</strong> {order.customerInfo.email}
                        </Text>
                      </GridItem>
                      <GridItem>
                        <Text fontSize="sm">
                          <strong>SĐT:</strong> {order.customerInfo.phone}
                        </Text>
                        <Text fontSize="sm">
                          <strong>Địa chỉ:</strong> {order.customerInfo.shippingAddress}
                        </Text>
                      </GridItem>
                    </Grid>
                  </Box>

                  <Divider />

                  {/* Order Items */}
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Sản phẩm:
                    </Text>
                    <VStack spacing={3} align="stretch">
                      {order.items.map((item, index) => (
                        <HStack key={index} spacing={4}>
                          <Image
                            src={item.product.photos[0]}
                            alt={item.product.title}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                          <Box flex={1}>
                            <Text fontWeight="semibold">
                              {item.product.title}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              Số lượng: {item.quantity}
                            </Text>
                            <Text fontSize="sm" color="blue.600">
                              ${item.price}
                            </Text>
                          </Box>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Order Summary */}
                  <HStack justify="space-between">
                    <VStack align="flex-start" spacing={1}>
                      <Text fontSize="sm">
                        <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
                      </Text>
                      {order.razorpayOrderId && (
                        <Text fontSize="sm">
                          <strong>Razorpay Order ID:</strong> {order.razorpayOrderId}
                        </Text>
                      )}
                    </VStack>
                    <VStack align="flex-end" spacing={1}>
                      <Text fontSize="lg" fontWeight="bold" color="blue.600">
                        Tổng cộng: ${order.totalAmount}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Orders;
