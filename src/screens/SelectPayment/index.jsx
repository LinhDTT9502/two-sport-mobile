// SelectPayment.js
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  TextInput, Modal
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  selectCheckout,
  selectRentalCheckout,
} from "../../api/Checkout/apiCheckout";
import PaymentMethod from "../../components/Payment/PaymentMethod";
import { Feather } from "@expo/vector-icons";
import { ModalPayment } from "./PaymentSuccess/ModalPayment";
import axios from "axios";
import DatePicker from '@react-native-community/datetimepicker';

function SelectPayment({ route }) {
  const { order } = route.params;
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState("1");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [modalVisiblePayment, setModalVisiblePayment] = useState(false);
  const [linkPayment, setLinkPayment] = useState("")
  const [deposit, setDeposit] = useState("DEPOSIT_50");
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("")
  const [showExtendedModal, setExtendedShowModal] = useState(false);
  const [selectedChildOrder, setSelectedChildOrder] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
  }, [status, showExtendedModal]);

  const handleCheck = async () => {
    if (paymentCompleted) {
      return;
    }
    const _d = order?.rentalOrderCode ? { transactionType: deposit } : {};
    try {
      if (selectedOption === "1") {
        // COD

        const data = order.rentalOrderCode
          ? await selectRentalCheckout({
            paymentMethodID: selectedOption,
            orderId: order.id,
            orderCode: order.rentalOrderCode || order.saleOrderCode,
            ..._d,
          })
          : await selectCheckout({
            paymentMethodID: parseInt(selectedOption),
            orderId: order.id,
            orderCode: order.saleOrderCode,
            ..._d,
          });
        setPaymentCompleted(true);
        navigation.navigate("AfterPayment")
      } else if (selectedOption === "2" || selectedOption === "3") {
        // PayOS or VNPay
        const data = (order.rentalOrderCode || order.rentalOrderCode === order.saleOrderCode)
          ? await selectRentalCheckout({
            paymentMethodID: parseInt(selectedOption),
            orderID: order.id,
            orderCode: order.rentalOrderCode,
            ..._d,
          })
          : await selectCheckout({
            paymentMethodID: parseInt(selectedOption),
            orderId: order.id,
            orderCode: order.saleOrderCode,
            ..._d,
          });

        if (data?.data?.data?.paymentLink) {
          setLinkPayment(data.data.data.paymentLink)
          setModalVisiblePayment(true)
          // Linking.canOpenURL(data.data.data.paymentLink).then((supported) => {
          //   if (supported) {
          //     // Linking.openURL(data.data.data.paymentLink);

          //   } else {
          //     console.log("Can't open URI:", data.data.data.paymentLink);
          //   }
          // });
        }

        // setPaymentCompleted(true);
        // Alert.alert("Thanh toán thành công", "Bạn đã thanh toán thành công.", [
        //   { text: "OK", onPress: () => navigation.navigate("HomeController") },
        // ]);
      } else if (selectedOption === "4") {
        // Bank Transfer
        const data = order.rentalOrderCode ?
          await selectRentalCheckout({
            paymentMethodID: parseInt(selectedOption),
            orderId: order.id,
            orderCode: order.rentalOrderCode || order.saleOrderCode,
            ..._d,
          })
          : await selectCheckout({
            paymentMethodID: parseInt(selectedOption),
            orderId: order.id,
            orderCode: order.saleOrderCode,
            ..._d,
          });
        setPaymentCompleted(true);
        Alert.alert(
          "Thanh toán thành công",
          "Bạn đã chọn thanh toán qua chuyển khoản ngân hàng.",
          [{ text: "OK", onPress: () => navigation.navigate("HomeController") }]
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      // Alert.alert(
      //   "Lỗi",
      //   "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."
      // );
    }
  };

  const data =
    order.saleOrderDetailVMs?.["$values"] ||
    order.children ||
    order?.childOrders?.["$values"];

  const handleCancelOrder = async () => {
    if (!reason.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do hủy đơn hàng.");
      return;
    }

    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              if (order.saleOrderCode) {
                console.log(`Cancelling sale order ${order.id} with reason: ${reason}`);
                const response = await axios.post(
                  `https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/request-cancel/${order.id}?reason=${encodeURIComponent(reason)}`,
                  null, // No request body
                  {
                    headers: {
                      accept: "*/*",
                    },
                  }
                );
              } else if (order.rentalOrderCode) {
                const response = await axios.post(
                  `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/request-cancel/${order.id}?reason=${encodeURIComponent(reason)}`,
                  null, // No request body
                  {
                    headers: {
                      accept: "*/*",
                    },
                  }
                );
              }

              setStatus("Đã hủy")
              Alert.alert("Thành công", "Bạn đã hủy đơn hàng thành công.");
              setShowModal(false);
              setReason(""); // Reset reason field
            } catch (error) {
              console.error("Error cancel order:", error);
              Alert.alert("Lỗi", "Không thể hủy đơn hàng. Vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };

  const handleUpdateOrderStatus = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn đã nhận được hàng?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đánh giá",
          onPress: async () => {
            try {
              const newStatus = 5;
              if (order.saleOrderCode) {
                console.log(`update sale order ${order.id}`);
                const response = await axios.put(
                  `https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/update-order-status/${order.id}?status=${newStatus}`,
                  null, // No request body
                  {
                    headers: {
                      accept: "*/*",
                    },
                  }
                );
                if (response.status === 200) {
                  navigation.navigate("AddReview", { orderId: order.id });
                }
              }
              else if (order.rentalOrderCode) {
                console.log(`update sale order ${order.id}`);
                const response = await axios.put(
                  `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/update-rental-order-status/${order.id}?orderStatus=${newStatus}`,
                  null, // No request body
                  {
                    headers: {
                      accept: "*/*",
                    },
                  }
                );
              }


              // Alert.alert("2Sport cảm ơn quý khách");

              setStatus("Đã giao hàng")
            } catch (error) {
              console.error("Error cancel order:", error);
              Alert.alert("Lỗi", "Không thể xác nhận.");
            }
          },
        },
      ]
    );
  };
  const handleDateChange = (event, date) => {
    if (date && new Date(date) > new Date(selectedChildOrder.rentalEndDate)) {
      setSelectedDate(date);
    } else {
      alert('Please select a date later than the rental end date.');
    }
    setShowDatePicker(false);
  };

  const fetchParentOrderId = async (parentOrderCode) => {
    try {
      const response = await axios.get(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/get-rental-order-by-orderCode?orderCode=${parentOrderCode}`
      );
      if (response.data.isSuccess) {
        return response.data.data.id;
      }
    } catch (error) {
      console.error('Failed to fetch parent order ID:', error);
      throw error;
    }
  };
  const handleExtension = async () => {
    let parentOrderId;
    let childOrderId = null;

    try {
      if (selectedChildOrder.parentOrderCode) {
        parentOrderId = await fetchParentOrderId(selectedChildOrder.parentOrderCode);
        childOrderId = selectedChildOrder.id;
      } else {
        parentOrderId = selectedChildOrder.id;
      }

      const extensionDays = Math.ceil(
        (new Date(selectedDate) - new Date(selectedChildOrder.rentalEndDate)) / (1000 * 60 * 60 * 24)
      ) + 1;

      const payload = {
        parentOrderId,
        childOrderId,
        extensionDays,
      };

      const response = await axios.post(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/request-extension`,
        payload,
        {
          headers: {
            accept: '*/*',
          },
        }
      );

      if (response.data.isSuccess) {
        setExtendedShowModal(false)
        console.log('Request successful:', response);
        alert('Extension requested successfully!');
      } else {
        console.log('Error response:', response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Request failed:', error.response || error.message);
      alert('Failed to request extension.');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#050505" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng </Text>
      </View>
      <View style={styles.buttonReq}>
        {order.orderStatus === "Đã giao cho ĐVVC" && (
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              paymentCompleted && styles.disabledButton,
            ]}
            onPress={handleUpdateOrderStatus}
          >
            <Text style={styles.checkoutText}>Đã nhận hàng</Text>
          </TouchableOpacity>
        )}


        {order.orderStatus === "Chờ xử lý" && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.cancelButtonText}>Hủy đơn</Text>
          </TouchableOpacity>
        )}
        <Modal
          transparent={true}
          visible={showModal}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Xác nhận hủy đơn hàng </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Vui lòng nhập lý do hủy đơn hàng"
                value={reason}
                onChangeText={setReason}
                multiline
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleCancelOrder}
                >
                  <Text style={styles.confirmButtonText}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <ScrollView style={styles.content}>
        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <View style={styles.card}>
            <InfoItem icon="user" label="Tên" value={order.fullName} />
            <InfoItem icon="mail" label="Email" value={order.email} />
            <InfoItem
              icon="phone"
              label="Số điện thoại"
              value={order.contactPhone}
            />
            <InfoItem icon="map-pin" label="Địa chỉ" value={order.address} />
            <InfoItem label="Tình trạng" value={status || order.orderStatus} />
            <InfoItem label="Trạng thái thanh toán" value={order.paymentStatus} />
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng: {order.saleOrderCode || order.rentalOrderCode} </Text>
          <View style={styles.card}>
            {(data?.length > 0 ? data : [order]).map((item, index) => {
              const _item = { ...item };
              console.log("thang con"+ item)
              console.log( _item)

              return (
                <View
                  key={item?.id}
                  style={{
                    flexDirection: "column",
                    gap: 8,
                    paddingBottom: 10,
                    marginBottom: 20,
                    borderBottom: "0.5px solid #e0e0e0",
                  }}
                >
                  <View style={styles.cardItem}>
                    <Image
                      source={{
                        uri:
                          _item?.imgAvatarPath ||
                          "https://via.placeholder.com/100",
                      }}
                      style={{ width: 80, height: 80 }}
                    />
                    <View key={index} style={styles.itemRow}>
                      <View>
                        <Text style={styles.itemName}>{_item.productName}</Text>
                        <Text style={styles.itemName2}>
                          Màu sắc: {_item.color}
                        </Text>
                        <Text style={styles.itemName2}>
                          Kích thước: {_item.size}
                        </Text>
                        <Text style={styles.itemName2}>
                          Tình trạng: {_item.condition}%
                        </Text>
                      </View>
                      <Text style={styles.itemQuantity}>
                        x{_item?.quantity}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {formatCurrency(_item.unitPrice || _item.subTotal)}
                      </Text>
                    </View>
                  </View>
                  <View>
                    {item?.rentalStartDate ? (
                      <Text>Ngày bắt đầu thuê: {item?.rentalStartDate}</Text>
                    ) : null}
                    {item?.rentalEndDate ? (
                      <Text>Ngày bắt đầu thuê: {item?.rentalEndDate}</Text>
                    ) : null}
                  </View>
                  {order.rentalOrderCode && (order.orderStatus === "Đang thuê" && _item.extensionStatus === "N/A") && (
                    <TouchableOpacity
                      style={[
                        styles.checkoutButton,
                        paymentCompleted && styles.disabledButton,
                      ]}
                      onPress={() => {
                        setSelectedChildOrder(_item);
                        setExtendedShowModal(true);
                      }}
                    >
                      <Text style={styles.checkoutText}>Yêu cầu gia hạn 
                    
                      </Text>
                    </TouchableOpacity>
                  )}

                </View>
              );
            })}
            <TotalItem
              label="Tổng cộng"
              value={formatCurrency(order.totalAmount)}
            />
            <TotalItem
              label="Phí vận chuyển"
              value={formatCurrency(order.tranSportFee)}
            />
            <TotalItem
              label="Thành tiền"
              value={formatCurrency(order.totalAmount + order.tranSportFee)}
              isTotal
            />
          </View>
        </View>
        {/*modal extend */}
        {showExtendedModal &&
          <Modal
            transparent={true}
            visible={showExtendedModal}
            animationType="slide"
            onRequestClose={() => setExtendedShowModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Chọn thời gian gia hạn </Text>
               {/* chọn ngày gia hạn */}
               <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : 'Select a date'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DatePicker
                value={selectedDate || new Date(selectedChildOrder.rentalEndDate)}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date(selectedChildOrder.rentalEndDate)}
              />
            )}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setExtendedShowModal(false)}
                  >
                    <Text style={styles.closeButtonText}>Đóng</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleExtension}
                  >
                    <Text style={styles.confirmButtonText}>Xác nhận</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        }
        {/* Payment Method */}
        {order?.rentalOrderCode ? (
          <>
            {(order.orderStatus !== "Đã hủy" || status === "Đã hủy") && order?.depositStatus === "N/A" ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đặt cọc</Text>
                {[
                  { title: "Đặt cọc 50%", value: "DEPOSIT_50" },
                  { title: "Trả full 100%", value: "DEPOSIT_100" },
                ].map((item) => (
                  <View key={item.value}>
                    <TouchableOpacity
                      onPress={() => setDeposit(item.value)}
                      style={[
                        styles.optionContainer,
                        selectedOption === item.value && styles.selectedOption,
                      ]}
                      disabled={paymentCompleted}
                    >
                      <View style={styles.optionContent}>
                        <Text
                          style={[
                            styles.optionText,
                            selectedOption === item.value && styles.selectedOptionText,
                            paymentCompleted && styles.disabledOptionText,
                          ]}
                        >
                          {item.title}
                        </Text>
                      </View>
                      {!order?.depositStatus || order?.depositStatus === "N/A" ? (
                        <View
                          style={[
                            styles.radioButton,
                            deposit === item.value && styles.selectedRadioButton,
                          ]}
                        >
                          {deposit === item.value && <View style={styles.selectedDot} />}
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : order?.depositStatus !== "N/A" ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đơn hàng đã đặt cọc</Text>
                <Text style={styles.depositText}>Số tiền:{order.depositAmount}</Text>
              </View>
            ) : null}
          </>
        ) : (
          <View></View>
        )}

        {(order.paymentStatus !== "Đã thanh toán" && order.paymentStatus !== "Đã đặt cọc") && order.orderStatus !== "Đã hủy" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            <PaymentMethod
              selectedOption={selectedOption || order.paymentMethodID}
              setSelectedOption={setSelectedOption}
              paymentCompleted={paymentCompleted}
              order={order}
            />
            {!order?.paymentMethodId && (
              <TouchableOpacity
                style={[
                  styles.checkoutButton,
                  paymentCompleted && styles.disabledButton,
                ]}
                onPress={handleCheck}
                disabled={paymentCompleted}
              >
                <Text style={styles.checkoutText}>Xác nhận thanh toán</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      </ScrollView>

      <ModalPayment isVisible={modalVisiblePayment} onClose={() => {
        setLinkPayment('')
        setModalVisiblePayment(false)
      }} link={linkPayment} onSuccess={() => {
        setLinkPayment('')
        setModalVisiblePayment(false)
        setPaymentCompleted(true)
        Alert.alert(
          "Thanh toán thành công",
          "Bạn đã xác nhận thanh toán đơn hàng thành công.",
          [{ text: "OK", onPress: () => navigation.navigate("HomeController") }]
        );
      }} />
    </View>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Feather name={icon} size={18} color="#666" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const TotalItem = ({ label, value, isTotal = false }) => (
  <View style={[styles.totalItem, isTotal && styles.finalTotal]}>
    <Text style={[styles.totalLabel, isTotal && styles.finalTotalLabel]}>
      {label}
    </Text>
    <Text style={[styles.totalValue, isTotal && styles.finalTotalValue]}>
      {value}
    </Text>
  </View>
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardItem: {
    flexDirection: "row",
    gap: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    flex: 1,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    width: "100%",
  },
  itemName2: {
    flex: 1,
    fontSize: 14,
    color: "#BDC3C7",
    width: "100%",
  },
  itemQuantity: {
    fontSize: 16,
    color: "#666",
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  totalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  finalTotal: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3366FF",
  },
  checkoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "#3366FF",
    borderRadius: 12,
    alignItems: "center",
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  datePickerText: {
    textAlign: 'center',
    color: '#555',
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  checkoutText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  selectedOption: {
    backgroundColor: "#F0F5FF",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  depositText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#3366FF",
    fontWeight: "600",
  },
  disabledOptionText: {
    color: "#BBBBBB",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3366FF",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadioButton: {
    borderColor: "#3366FF",
    backgroundColor: "#3366FF",
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  disabledRadioButton: {
    borderColor: "#BBBBBB",
  },
  buttonReq: {
    flexDirection: "row",
  },
  detailsContainer: {
    backgroundColor: "#F9FAFC",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
    lineHeight: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20,
  },
  bankInfo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  bankInfoItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bankInfoLabel: {
    fontSize: 14,
    color: "#666666",
    width: 120,
  },
  bankInfoValue: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  closeButtonText: {
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SelectPayment;
