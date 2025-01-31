const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());

app.use(
  "/api",
  createProxyMiddleware({
    target: "https://frontend-take-home-service.fetch.com",
    changeOrigin: true,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Origin", "https://frontend-take-home-service.fetch.com"); // Spoof request origin
    },
  })
);

app.listen(5000, () => console.log("Proxy server running on port 5000"));
