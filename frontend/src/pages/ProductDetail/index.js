/* import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchProduct } from "../../api";
import ImageGallery from "react-image-gallery";
import {
  Card,
  Stack,
  Heading,
  Text,
  Button,
  CardBody,
  CardFooter,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { useBasket } from "../../contexts/BasketContext";
import { useAuth } from "../../contexts/AuthContext";

function ProductDetail() {
  const { product_id } = useParams();
  const { addToBasket, items } = useBasket();
  const { loggedIn } = useAuth();
  const toast = useToast();

  const { isLoading, isError, data } = useQuery(["product", product_id], () =>
    fetchProduct(product_id)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  const findBasketItem = items.find((item) => item._id === product_id);
  const images = data.photos.map((url) => ({ original: url }));

  const handleAddToBasket = () => {
    if (!loggedIn) {
      toast({
        title: "Thêm vào giỏ hàng thành công!",
        description: "Bạn có thể đăng nhập sau để hoàn tất đơn hàng.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    addToBasket(data, findBasketItem);
  };

  return (
    <div>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <ImageGallery items={images} showThumbnails={false} />

        <Stack>
          <CardBody>
            <Heading size="md">{data.title}</Heading>

            <Text maxWidth={400} py="2">
              {data.description}
            </Text>
            <Text color="blue.600" fontSize="2xl">
              {data.price}$
            </Text>
          </CardBody>

          <CardFooter>
            <Tooltip 
              label={!loggedIn ? "Bạn có thể thêm vào giỏ hàng và đăng nhập sau để checkout" : ""}
              isDisabled={loggedIn}
            >
              <Button
                variant={findBasketItem ? "outline" : "solid"}
                colorScheme={findBasketItem ? "white" : "green"}
                onClick={handleAddToBasket}
                _hover={{
                  bg: findBasketItem ? "whiteAlpha.200" : "green.600",
                  color: findBasketItem ? "white" : "white"
                }}
              >
                {findBasketItem ? "Remove from basket" : "Add to Basket"}
              </Button>
            </Tooltip>
          </CardFooter>
        </Stack>
      </Card>
    </div>
  );
}

export default ProductDetail;
 */

import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchProduct } from "../../api";
import ImageGallery from "react-image-gallery";
import {
  Card,
  Stack,
  Heading,
  Text,
  Button,
  CardBody,
  CardFooter,
  HStack,
} from "@chakra-ui/react";
import { useBasket } from "../../contexts/BasketContext";

function ProductDetail() {
  const { product_id } = useParams();
  const {
    addToBasket,
    items,
    increaseQuantity,
    decreaseQuantity,
  } = useBasket();

  const { isLoading, isError, data } = useQuery(["product", product_id], () =>
    fetchProduct(product_id)
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  // Tìm sản phẩm trong giỏ hàng
  const findBasketItem = items.find((item) => item._id === product_id);

  // Xử lý ảnh
  const images = data.photos.map((url) => ({ original: url }));

  return (
    <div>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <ImageGallery items={images} showThumbnails={false} />

        <Stack>
          <CardBody>
            <Heading size="md">{data.title}</Heading>

            <Text maxWidth={400} py="2">
              {data.description}
            </Text>
           <Text color="blue.600" fontSize="2xl">
  {findBasketItem
    ? `Subtotal: ${findBasketItem.quantity * Number(data.price)}$`
    : `Price: ${data.price}$`}
</Text>


            <CardFooter>
              {findBasketItem ? (
                <HStack spacing={4} align="center">
                  <Button onClick={() => decreaseQuantity(findBasketItem._id)}>-</Button>
                  <Text fontSize="lg" fontWeight="bold">
                    {findBasketItem.quantity}
                  </Text>
                  <Button onClick={() => increaseQuantity(findBasketItem._id)}>+</Button>
                </HStack>
              ) : (
                <Button
                  variant="solid"
                  colorScheme="whatsapp"
                  onClick={() => addToBasket(data, findBasketItem)}
                >
                  Add to Basket
                </Button>
              )}
            </CardFooter>

          </CardBody>
        </Stack>
      </Card>
    </div>
  );
}

export default ProductDetail;