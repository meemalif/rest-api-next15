const validate = (token: any) => {
  const validToken = true;
  if (!validToken || !token) {
    return false;
  }
  return true;
};

export const authMiddleware = async (request: Request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  return { isValid: validate(token) };
};
