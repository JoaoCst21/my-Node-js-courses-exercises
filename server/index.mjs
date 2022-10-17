import http from "http";

const host = "localhost";
const port = 8000;

const server = http.createServer((request, response) => {
  if (request.method === "POST") {
    let body = "";

    request.on("data", (chunk) => {
      console.log({ chunk });
      body += chunk;
    });

    request.on("close", () => {
      console.log(JSON.parse(body));
    });
    response.writeHead(201);
    response.end("ok");
    return;
  }
  response.writeHead(200);
  response.end("hi");
});

server.listen(port, host, () => {
  console.log(` Server on ${host}:${port}`);
});
