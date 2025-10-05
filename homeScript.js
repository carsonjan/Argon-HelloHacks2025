// import Posting from "./objects/Posting.js";
// import User from "./objects/User.js";

class User {
    constructor(id, name, avatar, age, gender, tags, school, about, pics, maxRent) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.age = age;
        this.gender = gender;
        this.school = school;
        this.about = about;
        this.pics = pics;
        this.maxRent = maxRent;
        this.tags = tags;
    }
}

const BACKEND_URL = "http://0.0.0.0:8000";

// a list of Posting to browse
const postings = [];

// make request to backend and populate postings with posting
function buildPostings() {
    fetch(BACKEND_URL, { method: "POST" })
        .then(response => response.json())
        .then(data => {
            // Validate backend response
            if (!data.postings || !Array.isArray(data.postings)) {
                console.error("Invalid response:", data);
                return;
            }

            // Convert JSON objects to User instances
            const postings = data.postings.map(p =>
                new User(
                    p.id,
                    p.name,
                    p.avatar,
                    p.age,
                    p.gender,
                    p.tags,
                    p.school,
                    p.about,
                    p.pics,
                    p.maxRent
                )
            );

            console.log("Fetched postings:", postings);

            // (optional) render to DOM or store globally
            displayPostings(postings);
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}


// remove the current posting from postings, render next card
function nextCard() {
    if (postings.length == 0) return;

    postings.pop();
    renderCurrentPosting();
}

// render first in line posting's data onto screen
function renderCurrentPosting() {
    if (postings.length == 0) return;
    
    first = postings.at(-1);

    document.querySelector("#avatar").src = "data:image/png;base64," + first.image;
    document.querySelector("#name").textContent = first.name + ",";
    document.querySelector("#age").textContent = first.age;
    const tags = document.querySelector("#tags");
    for (i = 0; i < first.tags.length; i++) {
        const newSpan = document.createElement("span");
        newSpan.textContent = tags.at(i);
        newSpan.style = "tag";
        tags.appendChild(newSpan);
    }
    document.querySelector("#school").textContent = first.school;
    document.querySelector("#aboutMeContent").textContent = first.about;
    for (i = 0; i < 3; i++) {
        document.querySelector("pics" + i).src = "data:image/png;base64," + first.pics.at(i);
    }
    document.querySelector("#rent").textContent = "$" + first.maxRent;
}

// show details for this posting
function showPostingDetails(Posting) {};

// call functions
buildPostings();
renderCurrentPosting();

document.querySelector("#yes").addEventListener("click", nextCard);
document.querySelector("#no").addEventListener("click", nextCard);