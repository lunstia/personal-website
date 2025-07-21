
async function readResponse(response) {
    const stream = response.body;
    const reader = stream.getReader();
    
     return new ReadableStream({
      start(controller) {
        // The following function handles each data chunk
        function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then(({ done, value }) => {
            // If there is no more data to read
            if (done) {
              console.log("done", done);
              controller.close();
              return;
            }
            // Get the data and send it to the browser via the controller
            controller.enqueue(value);
            // Check chunks by logging to the console
            console.log(done, value);
            push();
          });
        }

        push();
      },
    });
}
  

async function run() {
    const latestDiv = document.getElementById("latest");
    const popularDiv = document.getElementById("popular");

    await fetch('https://developers.medal.tv/v1/latest?userId=37135618&limit=3&autoplay=0', {
        method: 'GET',
        headers: {
            "Authorization": "pub_g1yIWvJmVO0TB2rBn89Dh7yET1vp3zSs",
        }
    }).then((response)=>{
        readResponse(response)
        .then((stream) =>
            new Response(stream, { headers: { "Content-Type": "text/html" } }).text(),
        )
        .then((result) => {
            const parsedResults = JSON.parse(result);
           
            const objects = parsedResults.contentObjects;
            console.log(objects)

            for (value in objects) {
                let object = objects[value];
                console.log(latestDiv)
                latestDiv.insertAdjacentHTML("beforeend", object.embedIframeCode)
            }
        });
    });

};

run();
