let highestZ = 100;

function updateClock() {
    const clock = document.getElementById("clock");

    if (clock) {
        clock.textContent = new Date().toLocaleString();
    }
}

updateClock();
setInterval(updateClock, 1000);

function openWindow(id) {
    const windowElement = document.getElementById(id);

    if (!windowElement) return;

    windowElement.classList.add("active");

    highestZ++;
    windowElement.style.zIndex = highestZ;
}

function closeWindow(id) {
    const windowElement = document.getElementById(id);

    if (!windowElement) return;

    windowElement.classList.remove("active");
}

function minimizeWindow(id) {
    const windowElement = document.getElementById(id);

    if (!windowElement) return;

    windowElement.classList.remove("active");
}

document.querySelectorAll(".window").forEach(windowElement => {

    windowElement.addEventListener("mousedown", () => {
        highestZ++;
        windowElement.style.zIndex = highestZ;
    });

});

document.querySelectorAll(".window").forEach(windowElement => {

    const header = windowElement.querySelector(".windowheader");

    if (!header) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("mousedown", (event) => {

        if (event.target.closest(".window-controls")) {
            return;
        }
        dragging = true;
        const rect = windowElement.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        highestZ++;
        windowElement.style.zIndex = highestZ;
    });
    document.addEventListener("mousemove", (event) => {
        if (!dragging) return;
        const desktop = document.getElementById("desktop");
        const desktopRect = desktop.getBoundingClientRect();
        let x = event.clientX - desktopRect.left - offsetX;
        let y = event.clientY - desktopRect.top - offsetY;
        x = Math.max(0, x);
        y = Math.max(0, y);
        const maxX = desktopRect.width - windowElement.offsetWidth;
        const maxY = desktopRect.height - windowElement.offsetHeight;
        x = Math.min(x, Math.max(0, maxX));
        y = Math.min(y, Math.max(0, maxY));
        windowElement.style.left = `${x}px`;
        windowElement.style.top = `${y}px`;
    });
    document.addEventListener("mouseup", () => {
        dragging = false;
    });
});

function setTheme(theme) {
    document.body.classList.remove(
        "theme-bg1",
        "theme-bg2",
        "theme-mono"
    );
    if (theme === "bg1") {
        document.body.classList.add("theme-bg1");
    }
    if (theme === "bg2") {
        document.body.classList.add("theme-bg2");
    }
    if (theme === "mono") {
        document.body.classList.add("theme-mono");
    }
    localStorage.setItem("aquaos-theme", theme);
}

const savedTheme = localStorage.getItem("aquaos-theme") || "bg1";

setTheme(savedTheme);

const notesArea = document.getElementById("notesArea");

if (notesArea) {
    notesArea.value = localStorage.getItem("aquaos-notes") || "";
}

function saveNotes() {
    const area = document.getElementById("notesArea");
    const status = document.getElementById("saveStatus");
    if (!area) return;
    localStorage.setItem("aquaos-notes", area.value);
    if (status) {
        status.textContent = "Saved!";
        setTimeout(() => {
            status.textContent = "";
        }, 1500);
    }
}

const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

if (terminalInput) {
    terminalInput.addEventListener("keydown", function(event) {
        if (event.key !== "Enter") return;
        const command = terminalInput.value.trim().toLowerCase();
        if (!command) return;
        terminalOutput.innerHTML +=
            `<div>aqu@aquaos:~$ ${command}</div>`;
        if (command === "help") {
            terminalOutput.innerHTML += `
                <div>Available commands:</div>
                <div>help</div>
                <div>clear</div>
                <div>date</div>
                <div>about</div>
                <div>projects</div>
            `;
        } else if (command === "clear") {
            terminalOutput.innerHTML = "";
        } else if (command === "date") {
            terminalOutput.innerHTML +=
                `<div>${new Date().toString()}</div>`;
        } else if (command === "about") {
            terminalOutput.innerHTML +=
                `<div>AquaOS — a personal web-based operating system.</div>`;
        } else if (command === "projects") {
            terminalOutput.innerHTML +=
                `<div>Try opening the Projects application.</div>`;
        } else {
            terminalOutput.innerHTML +=
                `<div>Command not found: ${command}</div>`;
        }
        terminalInput.value = "";
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const windows = [...document.querySelectorAll(".window.active")];
    if (windows.length === 0) return;
    windows.sort((a, b) => {
        return (parseInt(b.style.zIndex) || 0) -
               (parseInt(a.style.zIndex) || 0);
    });
    windows[0].classList.remove("active");
});