
async function readResponse(response) {
    const stream = response.body;
    const reader = stream.getReader();
    
     return new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
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

    await fetch('https://developers.medal.tv/v1/latest?userId=37135618&limit=3&autoplay=0&muted=0', {
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
