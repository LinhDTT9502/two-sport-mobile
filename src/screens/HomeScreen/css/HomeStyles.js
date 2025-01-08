import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 50,
    backgroundColor: "#F5F7FA",
  },
  content: {
    flex: 1,
  },
  wrapper: {
    height: 200,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pagination: {
    bottom: 10,
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.4)",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: "#FFFFFF",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    marginHorizontal: 16,
    color: "#333",
  },
  categoryContainer: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  categoryImage: {
    width: "80%",
    height: "80%",
    resizeMode: "cover",
  },
  placeholderIcon: {
    width: 28,
    height: 28,
    backgroundColor: "#4A90E2",
    borderRadius: 14,
  },
  categoryName: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  featuredSection: {
    marginTop: 24,
  },
  featuredProductsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  productCard: {
    width: (width - 60) / 2,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    margin:5,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 10,
  },
  discountTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6347",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#FF9900",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  flashSaleSection: {
    marginVertical: 20,
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 16,
  },
  recentlyViewedSection: {
    marginVertical: 20,
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 16,
  },

  flashSaleCard: {
    width: width * 0.4,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  recentlyViewedCard: {
    width: width * 0.4,
    marginRight:100,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  viewAllButton: {
    backgroundColor: "#4A90E2",
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  promotionalSection: {
    marginTop: 24,
    paddingBottom: 16,
    backgroundColor: "#F5F7FA",
  },
  promotionalContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  promotionalCard: {
    width: width - 48,
    height: 180,
    marginHorizontal: 8,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  promotionalContent: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
  },
  promotionalTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  promotionalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  promotionalSubtitle: {
    fontSize: 18,
    opacity: 0.8,
  },
  promotionalImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  viewAllText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6347",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 13,
    textAlign: "center",
    overflow: "hidden",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  allCategoriesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FF6347",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  flashSaleContainer:{
    marginRight:30,
  },
  recentlyViewedContainer:{
    marginRight:50,
  },
  
});

export default styles;
