(() => {
    const complaintPhotoSelector = ".complaint-photo, .complaint-image img";
    let modal;
    let previewImage;
    let closeButton;
    let sourceImage;
    let closeTimer;

    function createModal() {
        if (modal) return;

        modal = document.createElement("div");
        modal.className = "image-preview-modal";
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        modal.innerHTML = '<div class="image-preview-dialog" role="dialog" aria-modal="true" aria-label="Complaint photo preview" tabindex="-1"><button class="image-preview-close" type="button" aria-label="Close photo preview">&times;</button><img class="image-preview-full-image" alt=""></div>';

        previewImage = modal.querySelector(".image-preview-full-image");
        closeButton = modal.querySelector(".image-preview-close");
        closeButton.addEventListener("click", closePreview);
        modal.addEventListener("click", event => {
            if (event.target === modal) closePreview();
        });
        document.body.appendChild(modal);
    }

    function openPreview(image) {
        createModal();
        window.clearTimeout(closeTimer);
        sourceImage = image;
        previewImage.src = image.currentSrc || image.src;
        previewImage.alt = image.alt || "Complaint photo";
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("image-preview-open");

        window.requestAnimationFrame(() => {
            modal.classList.add("is-open");
            closeButton.focus();
        });
    }

    function closePreview() {
        if (!modal || modal.hidden) return;

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("image-preview-open");
        closeTimer = window.setTimeout(() => {
            modal.hidden = true;
            previewImage.removeAttribute("src");
            if (sourceImage?.isConnected) sourceImage.focus();
            sourceImage = null;
        }, 160);
    }

    document.addEventListener("click", event => {
        const image = event.target.closest?.(complaintPhotoSelector);
        if (image) openPreview(image);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal && !modal.hidden) {
            closePreview();
            return;
        }

        const target = event.target;
        if ((event.key === "Enter" || event.key === " ") &&
            target.matches?.(complaintPhotoSelector)) {
            event.preventDefault();
            openPreview(target);
            return;
        }

        if (event.key === "Tab" && modal && !modal.hidden) {
            event.preventDefault();
            closeButton.focus();
        }
    });
})();
