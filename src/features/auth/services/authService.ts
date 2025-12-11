import client from "../../../api/axios.client";
import { API_ROUTES } from "../../../config/constants";
import {
  type RegisterFields,
  type LoginFormFields,
  type ProfileFields,
  type ForgotPasswordFields,
  type ResetPasswordFields,
} from "../validators/authSchema";

// --- LOGIN ---
export const loginUserService = async (data: LoginFormFields) => {
  const response = await client.post("/users/login", data);
  return response.data;
};

// --- REGISTRO ---
export const registerUserService = async (
  data: RegisterFields,
  file: File | null
) => {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("name", data.name);
  formData.append("lastName", data.lastName);
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (file) formData.append("image", file);

  const response = await client.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// --- ACTUALIZAR PERFIL ---
export const updateProfileService = async (
  data: ProfileFields,
  file: File | null
) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key as keyof ProfileFields];
    if (value !== undefined && value !== null && key !== "profilePicture") {
      formData.append(key, String(value));
    }
  });

  if (file) formData.append("profilePicture", file);

  const response = await client.patch(`${API_ROUTES.USERS}/update/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// --- OBTENER PERFIL (ME) ---
export const getMyProfileService = async () => {
  const response = await client.get(`${API_ROUTES.USERS}/profile`);
  return response.data;
};

// --- NUEVO: OLVIDÉ MI CONTRASEÑA ---
export const forgotPasswordService = async (data: ForgotPasswordFields) => {
  // Asegúrate que esta ruta coincida con tu backend (/forgot-password)
  const response = await client.post(
    `${API_ROUTES.USERS}/forgotpassword`,
    data
  );
  return response.data;
};

// --- NUEVO: RESTABLECER CONTRASEÑA ---
export const resetPasswordService = async (data: ResetPasswordFields) => {
  // Asegúrate que esta ruta coincida con tu backend (/reset-password)
  const response = await client.post(`${API_ROUTES.USERS}/resetpassword`, {
    email: data.email,
    pin: data.pin,
    password: data.password,
  });
  return response.data;
};
