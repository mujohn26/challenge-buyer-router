
const port =5000;
const server=require("./server");

server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
  
// const servers = server.listen(port);

