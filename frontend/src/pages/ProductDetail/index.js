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
} from "@chakra-ui/react";
import { useBasket } from "../../contexts/BasketContext";

function ProductDetail() {
  const { product_id } = useParams();
  const { addToBasket, items } = useBasket();

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
            <Button
              variant="solid"
              colorScheme={findBasketItem ? "red" : "whatsapp"}
              onClick={() => addToBasket(data, findBasketItem)}
            >
              {findBasketItem ? "Remove from basket" : "Add to Basket"}
            </Button>
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
              Subtotal: {findBasketItem.quantity * Number(data.price)}$
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