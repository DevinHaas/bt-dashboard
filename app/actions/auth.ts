export async function registerUser(email: string) {
  return {
    success: true,
    email: email,
    message: "User was successfully loged in 👍",
  };
}
