document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("resume-form");
    const previewIframe = document.getElementById("pdf-preview");
    const fileInput = document.getElementById("photo-upload");

    let typingTimer;

    form.addEventListener("input", function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(updatePreview, 500);
    });

    function updatePreview() {
        const formData = new FormData(form);
        formData.append("preview", "1");

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onloadend = function () {
                formData.append("photo_base64", reader.result);
                sendPreviewRequest(formData);
            };
            reader.readAsDataURL(file);
        } else {
            sendPreviewRequest(formData);
        }
    }

    function sendPreviewRequest(formData) {
        fetch("backend/generate_pdf.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            previewIframe.src = blobUrl;
        })
        .catch(error => console.error("Error updating preview:", error));
    }

    document.getElementById("add-experience").addEventListener("click", function () {
        const container = document.getElementById("experience-container");
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="experience-entry">
                <input type="text" name="job_titles[]" placeholder="Job Title" required>
                <input type="text" name="companies[]" placeholder="Company" required>
                <input type="text" name="durations[]" placeholder="Duration" required>
                <textarea name="job_descriptions[]" placeholder="Description" required></textarea>
                <button type="button" class="remove-entry">Remove</button>
            </div>
        `;
        container.appendChild(div);
        updatePreview();
    });

    document.getElementById("experience-container").addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-entry")) {
            e.target.parentElement.remove();
            updatePreview();
        }
    });

    document.getElementById("add-custom-section").addEventListener("click", function () {
        const container = document.getElementById("custom-sections");
        const div = document.createElement("div");
        div.innerHTML = `
            <input type="text" name="custom_section_titles[]" placeholder="Section Title" required>
            <textarea name="custom_section_contents[]" placeholder="Content" required></textarea>
            <button type="button" class="remove-entry">Remove</button>
        `;
        container.appendChild(div);
        updatePreview();
    });

    document.getElementById("custom-sections").addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-entry")) {
            e.target.parentElement.remove();
            updatePreview();
        }
    });

    updatePreview();
});
