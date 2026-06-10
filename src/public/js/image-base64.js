const imageFile = document.getElementById('imageFiles');
const imagesContainer = document.getElementById('imagesContainer');
const postForm = document.getElementById('postForm');

imageFile.addEventListener('change', function () {
    imagesContainer.innerHTML = '';

    const files = Array.from(imageFile.files);

    files.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = function () {
            const div = document.createElement('div');
            div.classList.add('border', 'p-2', 'mb-2');

            div.innerHTML = `
                <p>Imagen ${index + 1}</p>

                <input type="hidden" name="image_base64" value="${reader.result}">
                <input type="hidden" name="mime_type" value="${file.type}">

                <label>Licencia</label>
                <select class="form-control mb-2 license-select" name="license" required>
                    <option value="free">Sin copyright</option>
                    <option value="copyright">Con copyright</option>
                </select>

                <div class="watermark-container" style="display:none;">
                    <label>Texto marca de agua</label>
                    <input class="form-control mb-2 watermark-input" type="text" name="watermark_text">
                </div>
            `;

            imagesContainer.appendChild(div);

            const licenseSelect = div.querySelector('.license-select');
            const watermarkContainer = div.querySelector('.watermark-container');
            const watermarkInput = div.querySelector('.watermark-input');

            licenseSelect.addEventListener('change', function () {
                if (licenseSelect.value === 'copyright') {
                    watermarkContainer.style.display = 'block';
                } else {
                    watermarkContainer.style.display = 'none';
                    watermarkInput.value = '';
                }
            });
        };

        reader.readAsDataURL(file);
    });
});

postForm.addEventListener('submit', function (event) {
    const hiddenImages = document.querySelectorAll('input[name="image_base64"]');

    if (hiddenImages.length === 0) {
        event.preventDefault();
        alert('Debe seleccionar al menos una imagen');
    }
});