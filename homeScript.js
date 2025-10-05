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
let postings = [];

// make request to backend and populate postings with posting
function buildPostings() {
    fetch(BACKEND_URL + "/api/v1/postings", { method: "GET" })
        .then(response => response.json())
        .then(data => {
            // Validate backend response
            if (!data.postings || !Array.isArray(data.postings)) {
                console.error("Invalid response:", data);
                return;
            }

            // Convert JSON objects to User instances
            postings = data.postings.map(p =>
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
        })
        .catch(error => {
            console.error("Fetch error:", error);
        })
        .finally(() =>
            renderCurrentPosting()
        );
}


// remove the current posting from postings, render next card
function nextCard() {
    if (postings.length == 0) return;
    postings.pop();
    renderCurrentPosting();
    console.log("next card, left:" + postings.length);
}

// render first in line posting's data onto screen
function renderCurrentPosting() {
    if (postings.length == 0) return;
    
    first = postings.at(-1);

    document.querySelector("#avatar").src = "data:image/png;base64," + first.avatar;
    document.querySelector("#name").textContent = first.name + ",";
    document.querySelector("#age").textContent = first.age;
    const tags = document.querySelector("#tags");
    while (tags.firstChild) tags.removeChild(tags.firstChild);
    for (i = 0; i < first.tags.length; i++) {
        const newSpan = document.createElement("span");
        newSpan.textContent = first.tags[i];
        newSpan.className = "tag";
        tags.appendChild(newSpan);
    }
    document.querySelector("#school").textContent = first.school;
    document.querySelector("#aboutMeContent").textContent = first.about;
    document.querySelector("#rentValue").textContent = first.maxRent;
    for (i = 0; i < 3; i++) {
        document.querySelector("#pics" + i).src = "data:image/png;base64," + first.pics[i];
    }
}

// show details for this posting
function showPostingDetails(Posting) {};

// call functions
buildPostings();


document.querySelector("#yes").addEventListener("click", nextCard);
document.querySelector("#no").addEventListener("click", nextCard);