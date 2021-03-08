
    exports.BodyParser= async (request)=> {
         return new Promise((resolve, reject) => {
           let totalChunked = "" 
           request
             .on("error", err => {
               console.error(err)
               reject()
             })
             .on("data", chunk => {
               totalChunked += chunk // Data is in chunks, concatenating in totalChunked
             })
             .on("end", () => {
               if(totalChunked === "{'invalid': json"){
                 reject()
                // res.writeHead(500, { "Content-Type": "application/json" });

               }
               else{
               request.body = JSON.parse(totalChunked) // Adding Parsed Chunked into request.body
               resolve()}
             })
         })
       }

 
