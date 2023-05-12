export const GET = () => {
  return new Response(`
{
  "name": "Todo App",
  "icons": [
    {
      "src": "icon.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "${process.env.NEXT_PUBLIC_BASE_URL}/",
  "display": "minimal-ui",
  "gcm_sender_id": "890377760325"
}`);
};
