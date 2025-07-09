import { apiClient } from "../../api/base";

export const login = async (data) => {
  const response = await apiClient({
    method: "POST",
    endpoint: "/person/login",
    data,
  });
  return response ;
};

// export const requestPasswordReset = async (
//   data
// ) => {
//   const response = await apiClient({
//     method: "POST",
//     endpoint: "",
//     data,
//   });
//   return response ;
// };
// export const resetPassword = async (
//   data
// ) => {
//   const response = await apiClient({
//     method: "POST",
//     endpoint: "",
//     data,
//   });
//   return response ;
// };
