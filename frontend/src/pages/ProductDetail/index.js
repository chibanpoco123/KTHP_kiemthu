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
  const { addToBasket, items, increaseQuantity, decreaseQuantity } = useBasket();

  const { isLoading, isError, data } = useQuery(["product", product_id], () =>
    fetchProduct(product_id)
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  // Kiểm tra sản phẩm trong giỏ
  const findBasketItem = items.find((item) => item._id === product_id);

  // Ảnh gallery
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
          </CardBody>

          <CardFooter>
            <HStack spacing={4} align="center">
              {/* Nút Add luôn hiện */}
              <Button
                variant="solid"
                colorScheme="red"
                onClick={() => addToBasket(data)}
              >
                Add to Basket
              </Button>

              {/* Nếu có trong giỏ thì hiện thêm nút +/- */}
              {findBasketItem && (
                <HStack spacing={2}>
                  <Button onClick={() => decreaseQuantity(findBasketItem._id)}>
                    -
                  </Button>
                  <Text fontSize="lg" fontWeight="bold">
                    {findBasketItem.quantity}
                  </Text>
                  <Button onClick={() => increaseQuantity(findBasketItem._id)}>
                    +
                  </Button>
                </HStack>
              )}
            </HStack>
          </CardFooter>
        </Stack>
      </Card>
    </div>
  );
}

export default ProductDetail;
