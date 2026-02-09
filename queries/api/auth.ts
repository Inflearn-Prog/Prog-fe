export const postAuth = async ({
  provider,
  authCode,
}: {
  provider: string;
  authCode: string;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/social-login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, authCode }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
};
