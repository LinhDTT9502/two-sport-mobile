import React from "react";
import { Modal, Alert } from "react-native";
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface ModalPaymentProps {
  isVisible: boolean;
  onClose: () => void;
  link: string;
  onSucceed: () => void;
}

// Define the navigation type for the stack
type RootStackParamList = {
  HomeController: undefined; // Replace 'undefined' with params if needed
  PayOsCancel: undefined;
  PayOsSuccess: undefined
  VnPayCancel: undefined
  VnPaySuccess: undefined
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const ModalPayment: React.FC<ModalPaymentProps> = ({
  isVisible,
  onClose,
  link,
  onSucceed,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const API_URL = "https://twosportshop.vercel.app/";
  const PAYMENT_CANCEL_URL = API_URL + "payment-cancel";
  const PAYMENT_SUCCESS_URL = API_URL + "payment-success";

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <WebView
        source={{ uri: link }}
        onNavigationStateChange={(event) => {
          console.log(event.url);
          if (event.url === PAYMENT_CANCEL_URL) {
            onSucceed?.();
            navigation.navigate("PayOsCancel");
            onClose();
          } else if (event.url === PAYMENT_SUCCESS_URL) {
            onSucceed?.();
            navigation.navigate("PayOsSuccess");
            onClose();
            // Alert.alert(
            //   "Thanh toán thành công",
            //   "Bạn đã xác nhận thanh toán đơn hàng thành công.",
            //   [{ text: "OK" }]
            // );
          }
          //  else if (
          //   event.url.includes(API_URL +
          //     "sale-order-return-vnpay"
          //   )
          // ) {
          //   // Extract query parameters
          //   const url = new URL(event.url);
          //   const TransactionStatus = url.searchParams.get("TransactionStatus");

          //   // Check the status value
          //   if (TransactionStatus === "0") {
          //     navigation.navigate("VnPayCancel");
          //     console.log("This is sale order vnpay cancel");
          //   } else if (TransactionStatus === "00") {
          //     console.log("This is sale order vnpay success");
          //     // Payment success
          //     onSucceed?.();
          //     navigation.navigate("VnPaySuccess");
          //     Alert.alert(
          //       "Thanh toán thành công",
          //       "Bạn đã xác nhận thanh toán đơn hàng thành công.",
          //       [{ text: "OK" }]
          //     );
          //   }
          // } else  if (
          //   event.url.includes(API_URL +
          //     "rental-order-cancel-payos"
          //   )
          // ) {
          //   navigation.navigate("PayOsCancel");
          //   console.log("this is rental order payos cancel")
          // } else if (event.url.includes(API_URL + "rental-order-return-payos")) {

          //   console.log("This is rental order payos success");
          //   // Payment success
          //   onSucceed?.();
          //   navigation.navigate("PayOsSuccess");
          //   Alert.alert(
          //     "Thanh toán thành công",
          //     "Bạn đã xác nhận thanh toán đơn hàng thành công.",
          //     [{ text: "OK" }]
          //   );
          // } else if (
          //   event.url.includes(API_URL +
          //     "rental-order-return-vnpay"
          //   )
          // ) {
          //   // Extract query parameters
          //   const url = new URL(event.url);
          //   const TransactionStatus = url.searchParams.get("TransactionStatus");

          //   // Check the status value
          //   if (TransactionStatus === "0") {
          //     navigation.navigate("VnPayCancel");
          //     console.log("This is rental vnpay cancel");
          //   } else if (TransactionStatus === "00") {
          //     console.log("This is rental vnpay success");
          //     // Payment success
          //     onSucceed?.();
          //     navigation.navigate("VnPaySuccess");
          //     Alert.alert(
          //       "Thanh toán thành công",
          //       "Bạn đã xác nhận thanh toán đơn hàng thành công.",
          //       [{ text: "OK" }]
          //     );
          //   }
          // } 
        }}
      />
    </Modal>
  );
};
