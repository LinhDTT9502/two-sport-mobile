import {
  addShipmentDetail,
  deleteShipmentDetail,
  getShipmentDetails,
  updateShipmentDetail,
} from "../api/apiShipment";

export const getUserShipmentDetails = async (token) => {
  try {
    const response = await getShipmentDetails(token);
    return response.data.$values;
  } catch (error) {
    // console.error("Error fetching shipments:", error);
    throw new Error("Error fetching shipments");
  }
};

export const addUserShipmentDetail = async (token, data) => {
  try {
    const response = await addShipmentDetail(token, data);
return response.data.data;  } catch (error) {
    console.error("Error saving shipment details:", error);
    throw new Error("Error saving shipment details");
  }
};

export const updateUserShipmentDetail = async (id, token, data) => {
  try {
    const response = await updateShipmentDetail(id, token, data);
    return response.data;
  } catch (error) {
    console.error("Error updating shipment details:", error);
    throw new Error("Error updating shipment details");
  }
};

export const deleteUserShipmentDetail = async (id, token) => {
  try {
    const response = await deleteShipmentDetail(id, token);
    return response;
  } catch (error) {
    console.error("Error deleting shipment details:", error);
    throw new Error("Error deleting shipment details");
  }
};
