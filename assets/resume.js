document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('resumeForm');
    const previewFrame = document.getElementById('previewFrame');
    const addExperienceBtn = document.getElementById('addExperience');
    const experienceContainer = document.getElementById('experienceContainer');
    const addCustomSectionBtn = document.getElementById('addCustomSection');
    const customSectionsContainer = document.getElementById('customSections');
    const photoInput = document.getElementById('photoUpload');

    function updatePreview() {
        const formData = new FormData(form);
        fetch('generate_pdf.php?preview=1', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            previewFrame.src = url;
        })
        .catch(error => console.error('Preview update failed:', error));
    }

    function addExperience() {
        const index = experienceContainer.children.length;
        const experienceHTML = `
            <div class="experience-entry">
                <input type="text" name="job_titles[]" placeholder="Job Title" required>
                <input type="text" name="companies[]" placeholder="Company" required>
                <input type="text" name="durations[]" placeholder="Duration" required>
                <textarea name="job_descriptions[]" placeholder="Description" required></textarea>
                <button type="button" class="remove-entry">Remove</button>
            </div>`;
        const div = document.createElement('div');
        div.innerHTML = experienceHTML;
        experienceContainer.appendChild(div);
        updatePreview();
    }

    function addCustomSection() {
        const index = customSectionsContainer.children.length;
        const sectionHTML = `
            <div class="custom-section">
                <input type="text" name="custom_section_titles[]" placeholder="Section Title" required>
                <textarea name="custom_section_contents[]" placeholder="Content" required></textarea>
                <button type="button" class="remove-entry">Remove</button>
            </div>`;
        const div = document.createElement('div');
        div.innerHTML = sectionHTML;
        customSectionsContainer.appendChild(div);
        updatePreview();
    }

    function encodeImageFileAsURL(element) {
        const file = element.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function () {
                document.getElementById('photoBase64').value = reader.result;
                updatePreview();
            }
            reader.readAsDataURL(file);
        }
    }

    photoInput.addEventListener('change', function () {
        encodeImageFileAsURL(this);
    });

    addExperienceBtn.addEventListener('click', addExperience);
    addCustomSectionBtn.addEventListener('click', addCustomSection);
    form.addEventListener('input', updatePreview);
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        fetch('generate_pdf.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => console.error('Download failed:', error));
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-entry')) {
            e.target.parentElement.remove();
            updatePreview();
        }
    });
});
