import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Text, Button, Alert, AlertIcon, Box,useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate()
  const { user, logout, loggedIn } = useAuth();
    const toast = useToast();
const handleLogout = async () => {
  await logout();      // chờ logout hoàn tất
  toast({
      title: "Đăng xuất thành công.",
      description: "Bạn đã đăng xuất khỏi hệ thống.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  navigate("/");       // rồi mới chuyển về trang chủ
};


  return (
    <div>
      {loggedIn === false && (
        <>
          <Alert status="warning">
            <AlertIcon />
            You are not logged in. please login and try again.
          </Alert>
          <Link to="/signin">
            <Button mt={4} colorScheme="whatsapp" variant="solid">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button mt={4} ml={4} colorScheme="facebook" variant="solid">
              Register
            </Button>
          </Link>
        </>
      )}
      {loggedIn === true && (
        <>
          <Text fontSize={28} fontWeight={700}>
            Profile
          </Text>
          <Box mt={4}>
            <Text fontSize={20}>email: {user.email}</Text>
            <Text fontSize={20}>role nè nha: {user.role}</Text>
          </Box>

          <br />
          <br />
          
            <Button colorScheme="pink" variant="solid" onClick={handleLogout}>
              Logout
            </Button>
        </>
      )}
    </div>
  );
}

export default Profile;
