import http, { createServer } from "http";
import app from "./app.js";

function main() {
  const server = createServer(app);

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server is runnig on http://loaclhost:${port}`);
  });
}

main();
