import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Radio,
  RadioGroup,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Divider,
  Card,
  CardBody,
  Image,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useBasket } from '../../contexts/BasketContext';
import { useAuth } from '../../contexts/AuthContext';
import { postOrder, postRazorpayOrder, updatePaymentStatus } from '../../api';

const Checkout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { items, emptyBasket } = useBasket();
  const { loggedIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const total = items.reduce((acc, item) => acc + item.price, 0);

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, 'Tên phải có ít nhất 2 ký tự')
      .max(100, 'Tên không được quá 100 ký tự')
      .required('Vui lòng nhập họ tên'),
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Vui lòng nhập email'),
    phone: Yup.string()
      .min(10, 'Số điện thoại không hợp lệ')
      .max(15, 'Số điện thoại không hợp lệ')
      .required('Vui lòng nhập số điện thoại'),
    shippingAddress: Yup.string()
      .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
      .max(500, 'Địa chỉ không được quá 500 ký tự')
      .required('Vui lòng nhập địa chỉ giao hàng'),
  });

  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: '',
      shippingAddress: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const orderData = {
          customerInfo: values,
          items: items.map(item => ({
            product: item._id,
            quantity: 1,
            price: item.price,
          })),
          paymentMethod,
          totalAmount: total,
        };

        if (paymentMethod === 'Razorpay') {
          // Create Razorpay order
          const response = await postRazorpayOrder(orderData);
          const { razorpayOrderId, razorpayOrder } = response;
          
          // Initialize Razorpay payment
          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'Your Store Name',
            description: 'Order Payment',
            order_id: razorpayOrderId,
            handler: async function (response) {
              try {
                // Update payment status
                await updatePaymentStatus(response.order_id, {
                  paymentId: response.razorpay_payment_id,
                  status: 'success',
                });
                
                toast({
                  title: 'Thanh toán thành công!',
                  description: 'Đơn hàng của bạn đã được xác nhận.',
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                });
                
                emptyBasket();
                navigate('/orders');
              } catch (error) {
                console.error('Payment verification failed:', error);
                toast({
                  title: 'Lỗi xác thực thanh toán',
                  description: 'Vui lòng liên hệ hỗ trợ.',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
              }
            },
            prefill: {
              name: values.fullName,
              email: values.email,
              contact: values.phone,
            },
            theme: {
              color: '#3399cc',
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // COD payment
          await postOrder(orderData);
          
          toast({
            title: 'Đặt hàng thành công!',
            description: 'Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ sớm nhất.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          
          emptyBasket();
          navigate('/orders');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast({
          title: 'Lỗi đặt hàng',
          description: 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!loggedIn) {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để tiếp tục thanh toán. Giỏ hàng của bạn sẽ được giữ nguyên.',
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
      setShouldRedirect(true);
      return;
    }

    // Kiểm tra giỏ hàng
    if (items.length === 0) {
      setShouldRedirect(true);
      return;
    }
  }, [loggedIn, items, toast]);

  useEffect(() => {
    if (shouldRedirect) {
      if (!loggedIn) {
        navigate('/signin');
      } else if (items.length === 0) {
        navigate('/basket');
      }
    }
  }, [shouldRedirect, loggedIn, items, navigate]);

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  // Nếu chưa đăng nhập hoặc không có sản phẩm, hiển thị loading
  if (!loggedIn || items.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center">
          <Spinner size="xl" />
          <Text mt={4}>Đang chuyển hướng...</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center" color="blue.600">
          Thanh toán đơn hàng
        </Heading>

        <HStack spacing={8} align="flex-start">
          {/* Order Summary */}
          <Box flex={1}>
            <Card>
              <CardBody>
                <Heading size="md" mb={4}>
                  Tóm tắt đơn hàng
                </Heading>
                <VStack spacing={4} align="stretch">
                  {items.map((item) => (
                    <HStack key={item._id} spacing={4}>
                      <Image
                        src={item.photos[0]}
                        alt={item.title}
                        boxSize="60px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <Box flex={1}>
                        <Text fontWeight="bold">{item.title}</Text>
                        <Text color="gray.600">${item.price}</Text>
                      </Box>
                    </HStack>
                  ))}
                  <Divider />
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Tổng cộng:
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      ${total}
                    </Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </Box>

          {/* Checkout Form */}
          <Box flex={1}>
            <Card>
              <CardBody>
                <Heading size="md" mb={6}>
                  Thông tin giao hàng
                </Heading>

                <form onSubmit={formik.handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isInvalid={formik.touched.fullName && formik.errors.fullName}>
                      <FormLabel>Họ và tên</FormLabel>
                      <Input
                        name="fullName"
                        placeholder="Nhập họ và tên"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {formik.errors.fullName}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Nhập email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {formik.errors.email}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={formik.touched.phone && formik.errors.phone}>
                      <FormLabel>Số điện thoại</FormLabel>
                      <Input
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {formik.errors.phone}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={formik.touched.shippingAddress && formik.errors.shippingAddress}>
                      <FormLabel>Địa chỉ giao hàng</FormLabel>
                      <Textarea
                        name="shippingAddress"
                        placeholder="Nhập địa chỉ giao hàng chi tiết"
                        value={formik.values.shippingAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        rows={3}
                      />
                      {formik.touched.shippingAddress && formik.errors.shippingAddress && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {formik.errors.shippingAddress}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel>Phương thức thanh toán</FormLabel>
                      <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
                        <Stack direction="column">
                          <Radio value="COD">
                            <HStack>
                              <Text>Thanh toán khi nhận hàng (COD)</Text>
                              <Badge colorScheme="green">Miễn phí</Badge>
                            </HStack>
                          </Radio>
                          <Radio value="Razorpay">
                            <HStack>
                              <Text>Thanh toán online (Razorpay)</Text>
                              <Badge colorScheme="blue">Bảo mật</Badge>
                            </HStack>
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>

                    {paymentMethod === 'Razorpay' && (
                      <Alert status="info">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Thanh toán an toàn!</AlertTitle>
                          <AlertDescription>
                            Bạn sẽ được chuyển đến trang thanh toán Razorpay để hoàn tất giao dịch.
                          </AlertDescription>
                        </Box>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      isLoading={loading}
                      loadingText="Đang xử lý..."
                    >
                      {paymentMethod === 'COD' ? 'Đặt hàng ngay' : 'Thanh toán với Razorpay'}
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>
          </Box>
        </HStack>
      </VStack>
    </Container>
  );
};

export default Checkout;
