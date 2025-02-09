document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("resume-form");
    const previewIframe = document.getElementById("pdf-preview");
    const fileInput = document.getElementById("photo-upload");
    const photoPreview = document.getElementById("photo-preview");
    const experienceContainer = document.getElementById("experience-sections");
    const customContainer = document.getElementById("custom-sections");

    if (!form || !previewIframe) {
        console.error("❌ Error: Form or PDF preview not found!");
        return;
    }

    let typingTimer;

    function updatePreview() {
        const formData = new FormData(form);
        const params = new URLSearchParams();
        formData.forEach((value, key) => params.append(key, value));

        console.log("🔄 Updating live preview...");
        previewIframe.src = "backend/generate_pdf.php?preview=1&" + params.toString();
    }

    // **Live Preview Updates on Input**
    form.addEventListener("input", function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(updatePreview, 500);
    });

    // **Photo Upload Preview**
    if (fileInput && photoPreview) {
        fileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    photoPreview.src = e.target.result;
                    document.getElementById("photo-base64").value = e.target.result;
                    updatePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    } else {
        console.error("❌ Error: 'photo-upload' input or 'photo-preview' image not found!");
    }

    // **Add Experience Section**
    window.addExperience = function () {
        if (!experienceContainer) {
            console.error("❌ Error: 'experience-sections' container not found!");
            return;
        }

        const section = document.createElement("div");
        section.classList.add("experience-entry", "p-4", "border", "mb-4", "bg-gray-50", "rounded");
        section.innerHTML = `
            <input type="text" name="job_titles[]" placeholder="Job Title" class="border p-2 w-full mb-2">
            <input type="text" name="companies[]" placeholder="Company" class="border p-2 w-full mb-2">
            <input type="text" name="durations[]" placeholder="Duration" class="border p-2 w-full mb-2">
            <textarea name="job_descriptions[]" placeholder="Job Description" class="border p-2 w-full mb-2"></textarea>
            <button type="button" class="remove-experience bg-red-500 text-white px-2 py-1 rounded">❌ Remove</button>
        `;
        experienceContainer.appendChild(section);

        section.querySelector(".remove-experience").addEventListener("click", function () {
            section.remove();
            updatePreview();
        });

        updatePreview();
    };

    // **Add Custom Section**
    window.addCustomSection = function () {
        if (!customContainer) {
            console.error("❌ Error: 'custom-sections' container not found!");
            return;
        }

        const section = document.createElement("div");
        section.classList.add("custom-entry", "p-4", "border", "mb-4", "bg-gray-50", "rounded");
        section.innerHTML = `
            <input type="text" name="custom_section_titles[]" placeholder="Section Title" class="border p-2 w-full mb-2">
            <textarea name="custom_section_contents[]" placeholder="Section Content" class="border p-2 w-full mb-2"></textarea>
            <button type="button" class="remove-custom bg-red-500 text-white px-2 py-1 rounded">❌ Remove</button>
        `;
        customContainer.appendChild(section);

        section.querySelector(".remove-custom").addEventListener("click", function () {
            section.remove();
            updatePreview();
        });

        updatePreview();
    };

    updatePreview(); // Ensure preview updates on page load
});
