import React, { useState } from "react";
import {
  Card,
  Text,
  Image,
  Stack,
  Heading,
  CardBody,
  CardFooter,
  Divider,
  ButtonGroup,
  Button,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useBasket } from "../../contexts/BasketContext";
import { useAuth } from "../../contexts/AuthContext";

function Cards({ item }) {
  const { addToBasket, items } = useBasket();
  const { loggedIn } = useAuth();
  const toast = useToast();

  const findBasketItem = items.find(
    (basket_item) => basket_item._id === item._id
  );

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
    addToBasket(item, findBasketItem);
  };

  return (
    <Card maxW="sm">
      <Link to={`/product/${item._id}`}>
        <CardBody>
          <Image
            src={item.photos[0]}
            alt="Product"
            borderRadius="lg"
            loading="lazy"
            boxSize={300}
            objectFit="cover"
          />
          <Stack mt="6" spacing="3">
            <Heading size="md">{item.title}</Heading>
            <Text>{moment(item.createdAt).format("DD/MM/YYYY")}</Text>
            <Text color="blue.600" fontSize="2xl">
              {item.price}$
            </Text>
          </Stack>
        </CardBody>
        <Divider />
      </Link>
      <CardFooter>
        <ButtonGroup spacing="2">
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
              {findBasketItem ? "Remove from Basket" : "Add to Basket"}
            </Button>
          </Tooltip>
          <Button variant="ghost" colorScheme="blue">
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default Cards;
