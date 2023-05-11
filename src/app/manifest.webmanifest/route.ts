export const GET = () => {
  return new Response(`
{
  "name": "Todo App",
  "icons": [
    {
      "src": "vercel.svg",
      "type": "image/svg+xml",
      "sizes": "512x512"
    }
  ],
  "start_url": "http://${process.env.NEXT_PUBLIC_VERCEL_URL}/",
  "display": "minimal-ui",
  "gcm_sender_id": "890377760325"
}`);
};
