const API_KEY = "aaeab1d265f34925831ff95e512d5c70";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error("Network response was not ok: " + res.statusText);
        }
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        alert("Failed to fetch news articles. Please try again later.");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = ""; // Clear existing cards

    articles.forEach((article) => {
        if (!article.urlToImage) return; // Skip articles without images
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage || "https://via.placeholder.com/400x200"; // Fallback image
    newsTitle.innerHTML = article.title || "No Title Available";
    newsDesc.innerHTML = article.description || "No description available.";

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Open article on card click
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");
const searchContainer = document.querySelector(".search-container");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;

    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

// Detect "Enter" key press in the search input
searchText.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        const query = searchText.value;
        if (!query) return;
        
        fetchNews(query);
        curSelectedNav?.classList.remove("active");
        curSelectedNav = null;
    }
});

// Show the search input when hovering over the search container
searchContainer.addEventListener("mouseenter", () => {
    const newsInput = document.querySelector(".news-input");
    newsInput.style.width = "200px"; // Expand the input
    newsInput.style.opacity = "1"; // Make it visible
    newsInput.style.visibility = "visible"; // Set visibility
    searchButton.style.display = "none"; // Hide search button
});

// Hide the search input and show the button when the mouse leaves
searchContainer.addEventListener("mouseleave", () => {
    const newsInput = document.querySelector(".news-input");
    newsInput.style.width = "0"; // Collapse the input
    newsInput.style.opacity = "0"; // Hide it
    newsInput.style.visibility = "hidden"; // Set visibility
    searchButton.style.display = "block"; // Show search button again
});
