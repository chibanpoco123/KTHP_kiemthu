import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Image,
  AlertIcon,
  Button,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Textarea,
} from "@chakra-ui/react";
import { useBasket } from "../../contexts/BasketContext";
import { useAuth } from "../../contexts/AuthContext";
import LoginPrompt from "../../components/LoginPrompt";

function Basket() {
  const [address, setAddress] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const { items, removeFromBasket, emptyBasket } = useBasket();
  const total = items.reduce((acc, obj) => acc + obj.price, 0);

  const handleSubmitForm = async () => {
    const itemIds = items.map((item) => item._id);
    const input = {
      address,
      items: JSON.stringify(itemIds),
    };

    await postOrder(input);

    emptyBasket();
    onClose();
  };

  return (
    <Box p="5">
      {items.length < 1 && (
        <Alert status="warning">
          <AlertIcon />
          You don’t have any items in your basket.
        </Alert>
      )}

      {items.length > 0 && (
        <>
          <ul style={({ listStyleType: "decimal" }, { display: "flex" })}>
            {items.map((item) => (
              <li key={item._id} style={({ margin: 20 }, { width: "25%" })}>
                <Link to={`/product/${item._id}`}>
                  <Text fontSize="22">
                    {item.title} - {item.price} $
                  </Text>
                  <Image
                    htmlWidth={300}
                    loading="lazy"
                    src={item.photos[0]}
                    alt="basket item"
                    boxSize={250}
                    objectFit="cover"
                    borderRadius="20px"
                  />
                </Link>
                <Button
                  mt="2"
                  size="sm"
                  colorScheme="red"
                  onClick={() => removeFromBasket(item._id)}
                >
                  Remove from Basket
                </Button>
              </li>
            ))}
          </ul>
          <Box mt="10">
            <Text fontSize="22">Total: {total}$</Text>
          </Box>
          {/* Order kısmı buradan sonra başlamaktadır. */}
          <Button onClick={onOpen} colorScheme="whatsapp" mt={4}>
            Buy now
          </Button>

          <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create your account</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Adress</FormLabel>
                  <Textarea
                    ref={initialRef}
                    placeholder="Adress"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSubmitForm}>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
}

export default Basket;





/* import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Image,
  AlertIcon,
  Button,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useBasket } from "../../contexts/BasketContext";
import { postOrder } from "../../api.js";

function Basket() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const { items, removeFromBasket, emptyBasket, increaseQuantity, decreaseQuantity } = useBasket();

  // ✅ Tính tổng có quantity
  const total = items.reduce((acc, obj) => acc + obj.price * obj.quantity, 0);

  // ✅ Xử lý submit đơn hàng
  const handleSubmitForm = async () => {
    if (!address.trim()) {
      toast({ status: "warning", title: "Please enter your address." });
      return;
    }
    if (items.length === 0) {
      toast({ status: "warning", title: "Your basket is empty." });
      return;
    }

    try {
      setLoading(true);
      const itemIds = items.map((item) => ({ id: item._id, quantity: item.quantity }));

      const input = { address, items: itemIds };

      await postOrder(input);

      toast({ status: "success", title: "Order placed successfully!" });
      emptyBasket();
      onClose();
    } catch (e) {
      toast({ status: "error", title: "Failed to place the order." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p="5">
      {items.length < 1 && (
        <Alert status="warning">
          <AlertIcon />
          You don’t have any items in your basket.
        </Alert>
      )}

      {items.length > 0 && (
        <>
          <ul
            style={{
              listStyleType: "decimal",
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              paddingLeft: 24,
            }}
          >
            {items.map((item) => (
              <li key={item._id} style={{ width: "25%", minWidth: 260, margin: 20 }}>
                <Link to={`/product/${item._id}`}>
                  <Text fontSize="20px" fontWeight="semibold">
                    {item.title}
                  </Text>
                  <Image
                    loading="lazy"
                    src={item.photos?.[0]}
                    alt={item.title}
                    boxSize="250px"
                    objectFit="cover"
                    borderRadius="20px"
                    mt={2}
                  />
                </Link>

              

                
                <Box mt={2}>
                  <Text fontSize="16px">
                    Price: ${item.price} × {item.quantity} ={" "}
                    <b>${item.price * item.quantity}</b>
                  </Text>
                </Box>

                
                <Box mt={2} display="flex" alignItems="center" gap={2}>
                  <Button size="sm" onClick={() => decreaseQuantity(item._id)}>
                    -
                  </Button>
                  <Text>{item.quantity}</Text>
                  <Button size="sm" onClick={() => increaseQuantity(item._id)}>
                    +
                  </Button>
                </Box>

                <Button
                  mt="2"
                  size="sm"
                  colorScheme="red"
                  onClick={() => removeFromBasket(item._id)}
                >
                  Remove from Basket
                </Button>
              </li>
            ))}
          </ul>

         
          <Box mt="10">
            <Text fontSize="22px" fontWeight="bold">
              Total: ${total}
            </Text>
          </Box>

          
          <Button onClick={onOpen} colorScheme="whatsapp" mt={4}>
            Buy now
          </Button>

         
          <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Place your order</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl isRequired>
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    ref={initialRef}
                    placeholder="Enter your delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={handleSubmitForm}
                  isLoading={loading}
                  isDisabled={loading || !address.trim()}
                >
                  Save
                </Button>
                <Button onClick={onClose} isDisabled={loading}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
}

export default Basket; */

