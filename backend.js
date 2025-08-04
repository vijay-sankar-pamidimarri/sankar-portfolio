const backendUrl = "https://portfolio-xf80.onrender.com/Personal-portfolio";

// This is for Testin The Backend Connection
// alert("Testing backend connection...");
// fetch(`${backendUrl}/test`, {
//     method: "GET",
// })
// .then(response => {
//     if (!response.ok) {
//         throw new Error("Network response was not ok");
//     }
//     return response.text();
// })
// .then(data => {
//     alert(`Backend is working: ${data}`);
// })
// .catch(error => {
//     console.error("Error connecting to backend:", error);
//     document.getElementById("backend-status").innerText =
//         "Error connecting to backend: " + error.message;
// });
// // ----------------------------------------------------------------------------



var IntroTable;
var skillTable;
var projectTable;
var aboutTable;
var footerTable;
var downloadresumeTable;
var notesList;

function fetchData() {
    fetch(`${backendUrl}/latest-one`,{
        method: "GET"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        IntroTable = data.introTable;
        skillTable = data.skillsTable;
        projectTable = data.projects;
        aboutTable = data.aboutMe;
        footerTable = data.footer;
        downloadresumeTable = data.downloadResume;
        notesList=data.notice;
        // You can now use these variables to populate your frontend
        console.log("IntroTable :"+IntroTable);
        console.log("skillTable :",skillTable);
        console.log("projectTable",projectTable);
        console.log("aboutTable :",aboutTable);
        console.log("footerTable",footerTable);
        console.log("downloadresumeTable :",downloadresumeTable);
        console.log("notesList :",notesList);
        renderIntroSection();
        renderSkillsSection();
        renderAboutMeParagraph();
        renderActivityNotes();
        renderProjectsSection()
        renderFooterLinks()
    })
    .Error(error => {
        console.error("Error fetching data:", error);
        document.getElementById("backend-status").innerText =
            "Error fetching data: " + error.message;
    })
}

window.onload=fetchData()

function renderIntroSection() {
    if (!IntroTable) return;

    const profileImg = document.getElementById("profile-image");
    const nameText = document.getElementById("name");
    const roleText = document.getElementById("role");

    // Set values
    profileImg.src = IntroTable.photo;
    nameText.innerText = IntroTable.header;
    roleText.innerText = IntroTable.quote;
}


function renderSkillsSection() {
    if (!skillTable || !skillTable.skills || skillTable.skills.length === 0) return;

    const container = document.getElementById("skills-container");
    container.innerHTML = ""; // Clear previous skills

    skillTable.skills.forEach(skill => {
        const skillDiv = document.createElement("div");
        skillDiv.classList.add("skill-item");
        skillDiv.textContent = skill;
        container.appendChild(skillDiv);
    });
}


function renderAboutMeParagraph() {
    if (!aboutTable || !aboutTable.content){
        console.log("No about me data available");
        return;
    }

    const paraDiv = document.getElementById("about-paragraph");
    paraDiv.querySelector("p") .textContent= aboutTable.content;
}


function renderActivityNotes() {
    const ul = document.getElementById("activity-log-list");
    ul.innerHTML = ""; // Clear existing content

    if (!notesList || !notesList.li || notesList.li.length === 0) {
        ul.innerHTML = "<li>No activity notes found.</li>";
        return;
    }

    notesList.li.forEach(note => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${note.link}" target="_blank">${note.name}</a>`;
        ul.appendChild(li);
    });

    console.log("Rendered notes:", notesList.li);
}




function renderProjectsSection() {
    if (!projectTable || !projectTable.projectLayoutList || projectTable.projectLayoutList.length === 0) {
        console.warn("No projects found.");
        return;
    }

    const container = document.getElementById("project-container");
    container.innerHTML = ""; // Clear previous content

    projectTable.projectLayoutList.forEach(project => {
        const card = document.createElement("div");
        card.classList.add("project-card");

        card.innerHTML = `
            <img src="${project.image}" alt="${project.head}" class="project-image" />
            <h3 class="project-title">${project.head}</h3>
            <p class="project-description">${project.description}</p>
            <a href="${project.link}" target="_blank" class="project-link">View Project</a>
        `;

        container.appendChild(card);
    });

    console.log("Rendered project cards:", projectTable.projectLayoutList);
}



function renderFooterLinks() {
    if (!footerTable || !footerTable.nodes || footerTable.nodes.length === 0) {
        console.warn("No footer links available.");
        return;
    }

    const ul = document.getElementById("footer-links");
    ul.innerHTML = ""; // Clear old links

    footerTable.nodes.forEach(node => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${node.link}" target="_blank">${node.text}</a>`;
        ul.appendChild(li);
    });

    console.log("Rendered footer links:", footerTable.nodes);
}


function sendMail() {
    const nameInput = document.getElementById("name2");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");


    if (!nameInput || !emailInput || !messageInput) {
        alert("Form inputs not found.");
        return;
    }

    const sub = nameInput.value.trim();
    const mail = emailInput.value.trim();
    const descr = messageInput.value.trim();
    if (!sub || !mail || !descr) {
        alert("Please fill in all fields.");
        return;
    }

    fetch(`${backendUrl}/send-mail`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ sub, mail, descr })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network error");
        }
        return response.text(); // because backend returns a string
    })
    .then(data => {
        alert(data); // Show the string message
        document.getElementById("contactForm").reset();
    })
    .catch(error => {
        console.error("Error sending email:", error);
        alert("An error occurred while sending the email.");
    });
}


function showAdminLogin() {
  document.getElementById("admin-login").style.display = "block";
}

function verifyAdmin() {
  const username = document.getElementById("admin-key").value;
  if (username !== "Sankar#220@Albert.in") {
    alert("Invalid Admin Key");
  } else {
    alert("Access Granted!");
    window.location.href = "test.html";
    // You can redirect or show admin options here
  }
}



function downloadResume() {
  if (
    !downloadresumeTable ||
    !downloadresumeTable.data ||
    !downloadresumeTable.fileType ||
    !downloadresumeTable.fileName
  ) {
    alert("Resume data is missing or incomplete!");
    return;
  }

  const dataUrl = `data:${downloadresumeTable.fileType};base64,${downloadresumeTable.data}`;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = downloadresumeTable.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
