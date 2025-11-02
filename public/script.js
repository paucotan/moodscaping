console.log("Moodscaping script loaded.");

const quoteAPIUrl = "http://localhost:3000/quote";
const randomButton = document.getElementById("random-mood-button");
const keywordForm = document.getElementById("keyword-form");
const textInput = document.getElementById("text-input");
const quoteContainer = document.getElementById("quote-container");
const imagePortrait = document.getElementById("image-portrait");
const imageAttribution = document.getElementById("image-attribution");
const loadingIndicator = document.getElementById("loading-indicator");
const keywordHistoryList = document.getElementById("keyword-history-list");
const newMoodButton = document.getElementById("new-mood-button");
const keywordHistorySection = document.querySelector(".keyword-history");

const MAX_HISTORY = 6;
const TRANSITION_DELAY = 220;

const curatedImages = [
  {
    keywords: ["calm", "serene", "peace", "tranquil", "still"],
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    alt: "A moonlit lake mirroring a starry night sky and distant mountains.",
    credit: "Unsplash — Moonlit Calm"
  },
  {
    keywords: ["sunrise", "hope", "light", "renewal", "dawn"],
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    alt: "Golden sunbeams cresting over rolling mountain ridges above a sea of clouds.",
    credit: "Unsplash — Mountain Dawn"
  },
  {
    keywords: ["forest", "growth", "renew", "earth", "green"],
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    alt: "Sunlight filtering through a dense evergreen forest with lush ferns.",
    credit: "Unsplash — Forest Light"
  },
  {
    keywords: ["ocean", "wave", "flow", "sea", "breathe"],
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    alt: "Soft turquoise waves rolling under a pink and lavender sunset.",
    credit: "Unsplash — Ocean Hush"
  },
  {
    keywords: ["stars", "dream", "night", "cosmic", "sky"],
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    alt: "The Milky Way arching across a clear night sky above silhouetted peaks.",
    credit: "Unsplash — Celestial Drift"
  },
  {
    keywords: ["bloom", "joy", "spring", "color", "flower"],
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    alt: "Lavender fields stretching toward a pastel dusk horizon.",
    credit: "Unsplash — Lavender Whisper"
  }
];

let keywordHistory = [];

function setLoading(isLoading) {
  if (!loadingIndicator) return;
  loadingIndicator.classList.toggle("is-active", isLoading);
  loadingIndicator.setAttribute("aria-hidden", String(!isLoading));
  [randomButton, newMoodButton, textInput].forEach((el) => {
    if (el) el.disabled = isLoading;
  });
}

function animateTransition(element, updateCallback) {
  if (!element) return;
  element.classList.add("is-transitioning");
  window.setTimeout(() => {
    updateCallback();
    element.classList.remove("is-transitioning");
  }, TRANSITION_DELAY);
}

function updateQuote(quoteText, quoteAuthor) {
  animateTransition(quoteContainer, () => {
    if (!quoteContainer) return;
    quoteContainer.innerHTML = "";
    const quoteParagraph = document.createElement("p");
    quoteParagraph.textContent = `“${quoteText}”`;

    const authorSpan = document.createElement("span");
    authorSpan.className = "quote-author";
    authorSpan.textContent = `— ${quoteAuthor || "Unknown"}`;

    quoteParagraph.appendChild(authorSpan);
    quoteContainer.appendChild(quoteParagraph);
  });
}

function updateImage(imageData) {
  if (!imageData || !imagePortrait || !imageAttribution) return;
  imagePortrait.classList.add("is-transitioning");

  const handleLoad = () => {
    imagePortrait.classList.remove("is-transitioning");
  };

  if (imagePortrait.src === imageData.url) {
    requestAnimationFrame(handleLoad);
  } else {
    imagePortrait.addEventListener("load", handleLoad, { once: true });
  }

  imagePortrait.alt = imageData.alt;
  imageAttribution.textContent = imageData.credit;
  imagePortrait.src = imageData.url;
}

function selectImage(context = "") {
  const lowerContext = context.toLowerCase();
  const matched = curatedImages.find((image) =>
    image.keywords.some((keyword) => lowerContext.includes(keyword))
  );
  if (matched) return matched;
  return curatedImages[Math.floor(Math.random() * curatedImages.length)];
}

function showError(message) {
  animateTransition(quoteContainer, () => {
    if (!quoteContainer) return;
    quoteContainer.innerHTML = "";
    const messageParagraph = document.createElement("p");
    messageParagraph.textContent = message;
    quoteContainer.appendChild(messageParagraph);
  });
}

function updateHistory(keyword) {
  if (!keyword) return;
  const entry = keyword.trim();
  if (!entry) return;

  keywordHistory = [entry, ...keywordHistory.filter((item) => item !== entry)].slice(
    0,
    MAX_HISTORY
  );
  renderHistory();
}

function renderHistory() {
  if (!keywordHistoryList || !keywordHistorySection) return;
  keywordHistoryList.innerHTML = "";

  if (keywordHistory.length === 0) {
    keywordHistorySection.classList.add("is-hidden");
    return;
  }

  keywordHistorySection.classList.remove("is-hidden");

  keywordHistory.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = entry;
    item.dataset.keyword = entry;
    keywordHistoryList.appendChild(item);
  });
}

async function fetchMood(keyword = "", options = {}) {
  const trimmedKeyword = keyword.trim();
  const query = trimmedKeyword ? `?keyword=${encodeURIComponent(trimmedKeyword)}` : "";

  setLoading(true);

  try {
    const response = await fetch(`${quoteAPIUrl}${query}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const quotes = Array.isArray(payload) ? payload : [payload];
    const validQuotes = quotes.filter((entry) => entry && (entry.q || entry.quote));

    if (validQuotes.length === 0) {
      throw new Error("No quotes found for the current request.");
    }

    const selection = validQuotes[Math.floor(Math.random() * validQuotes.length)];
    const quoteText = selection.q || selection.quote || "Take a mindful breath.";
    const quoteAuthor = selection.a || selection.author || "Unknown";

    updateQuote(quoteText, quoteAuthor);
    updateImage(selectImage(trimmedKeyword || quoteText));

    if (trimmedKeyword && !options.skipHistory) {
      updateHistory(trimmedKeyword);
    }

    if (trimmedKeyword && textInput) {
      textInput.value = "";
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
    showError("Could not load a mood right now. Try again in a moment.");
    updateImage(selectImage(keyword || "reset"));
  } finally {
    setLoading(false);
  }
}

if (randomButton) {
  randomButton.addEventListener("click", () => fetchMood());
}

if (keywordForm) {
  keywordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!textInput) return;
    const currentKeyword = textInput.value.trim();

    if (!currentKeyword) {
      textInput.focus();
      return;
    }

    fetchMood(currentKeyword);
  });
}

if (keywordHistoryList) {
  keywordHistoryList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const keyword = target.dataset.keyword;
    if (!keyword) return;

    if (textInput) {
      textInput.value = keyword;
    }
    fetchMood(keyword, { skipHistory: true });
  });
}

renderHistory();
fetchMood();
