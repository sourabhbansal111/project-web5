const themeKey = "fixmycityTheme";
let savedTheme = "light";

try {
    savedTheme = localStorage.getItem(themeKey) === "dark" ? "dark" : "light";
} catch (error) {
    savedTheme = "light";
}

document.documentElement.dataset.theme = savedTheme;

function addThemeToggle() {
    const actions = document.querySelector(
        ".auth-actions, .admin-actions, .worker-nav, .profile-nav-actions"
    );

    if (!actions || document.getElementById("themeToggle")) return;

    const button = document.createElement("button");
    button.id = "themeToggle";
    button.className = "theme-toggle";
    button.type = "button";
    button.setAttribute("aria-pressed", String(savedTheme === "dark"));

    function updateButton() {
        const darkIsActive = document.documentElement.dataset.theme === "dark";
        button.setAttribute("aria-pressed", String(darkIsActive));
        button.setAttribute("aria-label", darkIsActive ? "Switch to light theme" : "Switch to dark theme");
        button.title = darkIsActive ? "Switch to light theme" : "Switch to dark theme";
        button.innerHTML = darkIsActive
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg><span>Light</span>'
            : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.7 8.7 0 1 0 20.2 15.2Z"/></svg><span>Dark</span>';
    }

    button.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = nextTheme;
        try {
            localStorage.setItem(themeKey, nextTheme);
        } catch (error) {
            // Theme still works for this page when storage is unavailable.
        }
        updateButton();
    });

    // Keep the theme control in the navbar's top row, beside the brand.
    actions.parentElement.insertBefore(button, actions);
    updateButton();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addThemeToggle, { once: true });
} else {
    addThemeToggle();
}
