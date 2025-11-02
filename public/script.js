console.log("Moodscaping script loaded.");

// Grab DOM elements
const fetchButton = document.getElementById("random-mood-button");
const quoteContainer = document.getElementById("quote-container");
const keyword = document.getElementById('text-input');
const newMoodButton = document.getElementById("new-mood-button");

// Your own backend endpoint
const quoteAPIUrl = "http://localhost:3000/quote";

//Event listener for keyword input change
// newMoodButton.addEventListener('click', async () => {
//   const currentKeyword = keyword.value;
//   console.log(`Keyword updated to: ${currentKeyword}`);
//   try {
//     // 1️⃣ Fetch from your local proxy server with keyword
//     const response = await fetch(`${quoteAPIUrl}?keyword=${currentKeyword}`);

//     // 2️⃣ Convert response to JSON
//     const data = await response.json();

//     // 3️⃣ Extract quote text and author from the JSON
//     const quoteText = data[0].q;
//     const quoteAuthor = data[0].a;
//     console.log(`Fetched quote: "${quoteText}" - ${quoteAuthor}`);

//     // 4️⃣ Display them in your HTML
//     quoteContainer.innerHTML = `
//       <p>"${quoteText}"</p>
//       <p><em>- ${quoteAuthor}</em></p>
//       `;
//   } catch (error) {
//     console.error("Error fetching quote:", error);
//     quoteContainer.textContent = "Could not load a quote right now.";
//   }
// });

// Event listener for random button click
fetchButton.addEventListener("click", async () => {
  try {
    // 1️⃣ Fetch from your local proxy server
    const response = await fetch(quoteAPIUrl);

    // 2️⃣ Convert response to JSON
    const data = await response.json();

    // 3️⃣ Extract quote text and author from the JSON
    const quoteText = data[0].q;
    const quoteAuthor = data[0].a;
    console.log(`Fetched quote: "${quoteText}" - ${quoteAuthor}`);

    // 4️⃣ Display them in your HTML
    quoteContainer.innerHTML = `
      <p>"${quoteText}"</p>
      <p><em>- ${quoteAuthor}</em></p>
    `;

  } catch (error) {
    console.error("Error fetching quote:", error);
    quoteContainer.textContent = "Could not load a quote right now.";
  }
});
