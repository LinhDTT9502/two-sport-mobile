import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  orderSection: {
    backgroundColor: "#FFF",
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#FF9900",
    paddingBottom: 10,
  },
  statusMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statusButton: {
    alignItems: "center",
    width: "23%",
  },
  iconContainer: {
    borderRadius: 16,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 4,
    height: 32,
  },
  viewAllOrders: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginTop: 8,
  },
  viewAllOrdersText: {
    fontSize: 16,
    color: "#FF9900",
    fontWeight: "bold",
  },
});

export default styles;

