// src/styles/ProductDetailStyles.js
import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
const COLORS = {
  primary: "#0035FF",
  secondary: "#FA7D0B",
  dark: "#2C323A",
  light: "#CADDED",
  white: "#FFFFFF",
  black: "#000000",
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  webviewContainer: {
    overflow: "hidden", // Ensure content outside the WebView is hidden
    lineHeight: 20,
  },
  expandText: {
    color: "#007BFF", // Blue color for the link
    marginTop: 10,
    textAlign: "center",
  },
  webview: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  unavailableOption: {
    opacity: 0.5,
    backgroundColor: "#F5F5F5",
  },

  unavailableText: {
    color: "#A0A0A0",
  },

  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#F0F2F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E6EB",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#050505",
  },
  cartButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  productInfo: {
    padding: 0,
    backgroundColor: "#FFFFFF",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#050505",
    marginBottom: 8,
  },
  productTag: {
    fontSize: 14,
    color: "#65676B",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1877F2",
  },
  productRent: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#be123c",
  },
  originalPrice: {
    fontSize: 16,
    color: "#65676B",
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 14,
    color: "#E4123B",
    fontWeight: "bold",
  },
  section: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#050505",
    marginBottom: 12,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnContainer: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
  },
  colorSelector: {
    marginBottom: 16,
  },
  colorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.light,
    marginRight: 8,
  },
  activeColorButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  colorButtonText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  activeColorButtonText: {
    color: COLORS.white,
  },

  sizeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  sizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.light,
    marginRight: 8,
    marginBottom: 8,
  },
  activeSizeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeButtonText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  activeSizeButtonText: {
    color: COLORS.white,
  },

  conditionSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  conditionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.light,
    marginRight: 8,
    marginBottom: 8,
  },
  activeConditionButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  conditionButtonText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  activeConditionButtonText: {
    color: COLORS.white,
  },

  quantitySection: {
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 25,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
  },

  addToCartContainer: {
    marginTop: 16,
  },
  specificationText: {
    fontSize: 14,
    color: "#050505",
    marginBottom: 8,
  },
  promotionContainer: {
    marginTop: 8,
  },
  promotionItem: {
    fontSize: 14,
    color: "#050505",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#050505",
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  commentInputContainer: {
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#050505",
    textAlignVertical: "top",
  },
  commentSubmitButton: {
    backgroundColor: "#1877F2",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  commentSubmitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E4E6EB",
  },
  buyNowContainer: {
    flex: 1,
    marginRight: 8,
  },
  rentContainer: {
    flex: 1,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#050505",
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#1877F2",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#E4E6EB",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionSection: {
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#0035FF",
    borderRadius: 20,
  },
  activeOptionButton: {
    backgroundColor: "#0035FF",
  },
  optionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  activeOptionButtonText: {
    color: "#FFFFFF",
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  activeCircleButton: {
    borderColor: "#0035FF",
    backgroundColor: "#FFFFFF",
  },
  circleButtonText: {
    fontSize: 14,
    color: "#000000",
  },
  activeCircleButtonText: {
    color: "#0035FF",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  addToCartContainer: {
    marginTop: 16,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0035FF",
    marginTop: 8,
  },

  thumbnailList: {
    marginTop: 10,
  },
  thumbnailContainer: {
    marginRight: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedThumbnail: {
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  productImage: {
    width: "100%",
    height: Dimensions.get("window").width,
    resizeMode: "contain",
  },
  fullscreenImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.8,
  },

  colorOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E4E6EB",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },

  activeColorOptionContainer: {
    borderColor: "#FF5722", // Customize the color as per your design
  },

  colorOptionImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 8,
  },

  colorOptionText: {
    fontSize: 14,
    color: "#050505",
  },

  activeColorOptionText: {
    color: "#FF5722", // Customize the color for active text
  },
  cartIconContainer: {
    position: "relative",
    padding: 8,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default styles;
