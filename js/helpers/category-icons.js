(() => {
    const icons = {
        "Potholes": '<path d="M6 4 3.5 20M18 4l2.5 16M12 5v3m0 3v2m0 3v3"/><path d="M8.5 17c.8-1.8 1.8-2.7 3.5-2.7s2.7.9 3.5 2.7"/>',
        "Waste & Garbage": '<path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 10v7m4-7v7"/>',
        "Broken Streetlights": '<path d="M12 21V9m-3 12h6M7 4h10l-1 5H8L7 4Zm2 0V2h6v2"/><path d="M5 5H3m18 0h-2"/>',
        "Water Issues": '<path d="M12 3s-6 7.1-6 11a6 6 0 0 0 12 0c0-3.9-6-11-6-11Z"/><path d="M9 15a3 3 0 0 0 3 2"/>',
        "Damaged Roads": '<path d="M7 3 4 21m13-18 3 18M12 4v4l-2 2 4 2-3 3v4"/>',
        "Drainage": '<path d="M4 10h16M6 10v9m4-9v9m4-9v9m4-9v9M5 20h14"/><path d="M8 4v3m4-3v3m4-3v3"/>',
        "Other": '<circle cx="12" cy="12" r="8"/><path d="M12 8v8m-4-4h8"/>'
    };

    window.issueCategoryNames = Object.freeze(Object.keys(icons));
    window.issueCategoryIconMarkup = category => {
        const paths = icons[category] || '<circle cx="12" cy="12" r="8"/><path d="M12 8v8m-4-4h8"/>';
        return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
    };
})();
