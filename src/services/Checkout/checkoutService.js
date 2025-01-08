import { placedOrderAPI } from "../../api/Checkout/apiCheckout";

export const placedOrder = async (data) => {
  const formattedData = {
    ...data,
  };

  try {
    const response = await placedOrderAPI(formattedData);
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error.response?.data || error.message);

    const errorMessage =
      error.response?.data?.message ||
      "Không thể hoàn tất đơn hàng. Vui lòng thử lại.";

    throw new Error(errorMessage);
  }
};
