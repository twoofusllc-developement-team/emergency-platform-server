import { apiClient } from "../../api/base";

export const signup = async (
  credentials
) => {
  const response = await apiClient({
    method: "POST",
    endpoint: "/person/signup",
    data: credentials,
  });
  return response ;
};

// export const verifyEmail = async (
//   data
// ) => {
//   const response = await apiClient({
//     method: "POST",
//     endpoint: "",
//     data,
//   });
//   return response ;
// };

// export const resendVerificationCode = async (
//   email
// ) => {
//   const response = await apiClient({
//     method: "POST",
//     endpoint: "",
//     data: { email },
//   });
//   return response ;
// };
