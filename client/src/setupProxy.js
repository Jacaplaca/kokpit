const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  // app.use(proxy("/auth/google", { target: "http://localhost:5000/" }));
  // app.use(
  //   proxy("/auth/email", {
  //     target: "http://localhost:5000/",
  //     changeOrigin: true
  //   })
  // );
  // app.use(proxy("/auth/*", { target: "http://localhost:5000/" }));
  // app.use(proxy("/api/*", { target: "http://localhost:5000/" }));
  // app.use(proxy("/reset/token/*", { target: "http://localhost:5000/" }));
  // app.use(
  //   "/auth/email/**",
  //   proxy({ target: "http://localhost:5000/", changeOrigin: true })
  // );
  app.use(
    "/auth/**",
    proxy({ target: "http://localhost:5000/", changeOrigin: true })
  );
  app.use(
    "/api/**",
    proxy({ target: "http://localhost:5000/", changeOrigin: true })
  );
  app.use(
    "/reset/token/**",
    proxy({ target: "http://localhost:5000/", changeOrigin: true })
  );
  // app.use(
  //   "/auth/email/**",
  //   proxy({ target: "http://localhost:5000/", changeOrigin: true })
  // );
};
