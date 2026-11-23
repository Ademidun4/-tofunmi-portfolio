/* =====================================
   1. PROJECT DATA: ARRAY OF OBJECTS
===================================== */

const projects = [
    {
        title: "Brand Identity Design",
        description: "Visual identity and branding projects focused on building distinctive brands.",
        category: "Design"
    },
    {
        title: "Portfolio Website",
        description: "A personal portfolio website built with HTML, CSS and JavaScript.",
        category: "Development"
    },
    {
        title: "Creative Design Projects",
        description: "Graphic design projects exploring visual communication and creativity.",
        category: "Design"
    }
];


/* =====================================
   2. FUNCTIONS THAT RETURN VALUES
===================================== */

// Uses map() to get project titles
function getProjectTitles(projectData) {
    return projectData.map(project => project.title);
}

// Uses reduce() to count projects
function countProjects(projectData) {
    return projectData.reduce(total => total + 1, 0);
}


/* =====================================
   3. DISPLAY PROJECTS USING DOM
===================================== */

const projectList = document.getElementById("project-list");

function displayProjects(projectData) {
    projectList.replaceChildren();

    projectData.forEach(project => {
        const article = document.createElement("article");
        const heading = document.createElement("h3");
        const description = document.createElement("p");
        const category = document.createElement("small");

        article.classList.add("project-card");

        heading.textContent = project.title;
        description.textContent = project.description;
        category.textContent = project.category;

        article.append(heading, description, category);
        projectList.appendChild(article);
    });
}

displayProjects(projects);


/* =====================================
   4. EVENT DELEGATION
===================================== */

projectList.addEventListener("click", function(event) {
    const selectedCard = event.target.closest(".project-card");

    if (selectedCard && projectList.contains(selectedCard)) {
        console.log("Project selected:", selectedCard.textContent);
    }
});

console.log("Project titles:", getProjectTitles(projects));
console.log("Total projects:", countProjects(projects));


/* =====================================
   5. FETCH DATA FROM DUMMYJSON API
===================================== */

const apiList = document.getElementById("api-list");
const apiStatus = document.getElementById("api-status");
const searchInput = document.getElementById("api-search");
const userFilter = document.getElementById("user-filter");

let apiPosts = [];

async function fetchPosts() {
    try {
        apiStatus.textContent = "Loading posts...";

        const response = await fetch(
            "https://dummyjson.com/posts?limit=30"
        );

        if (!response.ok) {
            throw new Error("Unable to fetch data.");
        }

        const data = await response.json();

        apiPosts = data.posts;

        populateUserFilter(apiPosts);
        displayPosts(apiPosts);

        apiStatus.textContent =
            `Successfully loaded ${apiPosts.length} posts.`;

    } catch (error) {
        apiStatus.textContent =
            "Could not load posts. Please try again.";

        console.error("API Error:", error);
    }
}


/* =====================================
   6. POPULATE USER FILTER OPTIONS
===================================== */

function populateUserFilter(posts) {
    const userIds = [...new Set(posts.map(post => post.userId))];

    userIds.forEach(userId => {
        const option = document.createElement("option");

        option.value = userId;
        option.textContent = `User ${userId}`;

        userFilter.appendChild(option);
    });
}


/* =====================================
   7. DISPLAY API POSTS
===================================== */

function displayPosts(posts) {
    apiList.replaceChildren();

    if (posts.length === 0) {
        const message = document.createElement("p");

        message.textContent = "No matching posts found.";

        apiList.appendChild(message);
        return;
    }

    posts.forEach(post => {
        const article = document.createElement("article");
        const heading = document.createElement("h3");
        const paragraph = document.createElement("p");
        const author = document.createElement("small");

        article.classList.add("project-card");

        heading.textContent = post.title;
        paragraph.textContent = post.body;
        author.textContent = `Posted by User ${post.userId}`;

        article.append(heading, paragraph, author);
        apiList.appendChild(article);
    });
}


/* =====================================
   8. SEARCH AND FILTER API POSTS
===================================== */

function filterPosts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedUser = userFilter.value;

    const filteredPosts = apiPosts.filter(post => {

        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm) ||
            post.body.toLowerCase().includes(searchTerm);

        const matchesUser =
            selectedUser === "all" ||
            post.userId === Number(selectedUser);

        return matchesSearch && matchesUser;
    });

    displayPosts(filteredPosts);

    apiStatus.textContent =
        `Showing ${filteredPosts.length} of ${apiPosts.length} posts.`;
}

searchInput.addEventListener("input", filterPosts);
userFilter.addEventListener("change", filterPosts);

// Run API request
fetchPosts();


/* =====================================
   9. CONTACT FORM VALIDATION
===================================== */

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const messageError = document.getElementById("message-error");
    const formStatus = document.getElementById("form-status");

    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    formStatus.textContent = "";

    let isValid = true;

    if (name.value.trim() === "") {
        nameError.textContent = "Please enter your name.";
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.value.trim())) {
        emailError.textContent =
            "Please enter a valid email address.";

        isValid = false;
    }

    if (message.value.trim() === "") {
        messageError.textContent =
            "Please enter your message.";

        isValid = false;
    }

    if (isValid) {
        formStatus.textContent =
            "Your form has been validated successfully!";

        contactForm.reset();
    }
});


/* =====================================
   10. LOCALSTORAGE: THEME PREFERENCE
===================================== */

const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
    document.body.classList.toggle(
        "dark-theme",
        theme === "dark"
    );
}

// Restore saved theme
try {
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
        applyTheme(savedTheme);
    }

} catch (error) {
    console.error("Could not read saved theme:", error);
}

// Change and save theme
themeToggle.addEventListener("click", function() {

    const isDark = document.body.classList.contains("dark-theme");

    const newTheme = isDark ? "light" : "dark";

    applyTheme(newTheme);

    try {
        localStorage.setItem("portfolio-theme", newTheme);

    } catch (error) {
        console.error("Could not save theme:", error);
    }
});
