


    const form = document.getElementById('postForm');
    const imageInput = document.getElementById('images');
    const previewContainer = document.getElementById('previewContainer');
    const licenseSelect = document.getElementById('license');
    const watermarkField = document.getElementById('watermarkField');
    const watermarkInput = document.getElementById('watermark_text');

    let selectedImages = [];

    /*
    * Mostrar u ocultar el campo de marca de agua
    */
    licenseSelect.addEventListener('change', function () {

      if (this.value === 'copyright') {

        watermarkField.style.display = 'block';

      } else {

        watermarkField.style.display = 'none';
        watermarkInput.value = '';

      }

    });


    /*
    * Selección de imágenes
    */
    imageInput.addEventListener('change', function () {

      selectedImages = Array.from(this.files);

      previewContainer.innerHTML = '';

      if (selectedImages.length === 0) {
        return;
      }

      selectedImages.forEach(function (file) {

        if (!file.type.startsWith('image/')) {
          return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

          const preview = document.createElement('div');

          preview.className = 'preview-card';

          preview.innerHTML = `
            <img
              src="${event.target.result}"
              alt="Vista previa"
              class="preview-image"
            >

            <div class="preview-info">
              <i class="bi bi-image"></i>
              <span>${file.name}</span>
            </div>
          `;

          previewContainer.appendChild(preview);

        };

        reader.readAsDataURL(file);

      });

    });


    /*
    * Envío del formulario
    *
    * El controller espera:
    * image_base64
    * mime_type
    * license
    * watermark_text
    */
    form.addEventListener('submit', async function (event) {

      event.preventDefault();

      if (selectedImages.length === 0) {

        alert('Debés seleccionar al menos una imagen.');

        return;
      }


      if (!licenseSelect.value) {

        alert('Debés seleccionar una licencia.');

        return;
      }


      if (
        licenseSelect.value === 'copyright' &&
        !watermarkInput.value.trim()
      ) {

        alert('Debés ingresar un texto de marca de agua.');

        watermarkInput.focus();

        return;
      }


      const publishButton =
        document.getElementById('publishButton');

      publishButton.disabled = true;

      publishButton.innerHTML = `
        <span
          class="spinner-border spinner-border-sm me-2"
          role="status"
        ></span>
        Preparando publicación...
      `;


      /*
      * Convertimos cada imagen a Base64.
      */
      const base64Images = [];
      const mimeTypes = [];

      try {

        for (const file of selectedImages) {

          const base64 = await new Promise(function (resolve, reject) {

            const reader = new FileReader();

            reader.onload = function () {
              resolve(reader.result);
            };

            reader.onerror = function () {
              reject(new Error('No se pudo leer una imagen.'));
            };

            reader.readAsDataURL(file);

          });

          base64Images.push(base64);
          mimeTypes.push(file.type);

        }


        /*
        * Creamos los campos que espera el controller.
        */
        base64Images.forEach(function (imageBase64) {

          const input = document.createElement('input');

          input.type = 'hidden';
          input.name = 'image_base64';
          input.value = imageBase64;

          form.appendChild(input);

        });


        mimeTypes.forEach(function (mimeType) {

          const input = document.createElement('input');

          input.type = 'hidden';
          input.name = 'mime_type';
          input.value = mimeType;

          form.appendChild(input);

        });


        /*
        * Enviamos la licencia.
        */
        const licenseInput = document.createElement('input');

        licenseInput.type = 'hidden';
        licenseInput.name = 'license';
        licenseInput.value = licenseSelect.value;

        form.appendChild(licenseInput);


        /*
        * Enviamos la marca de agua.
        */
        const watermarkInputHidden =
          document.createElement('input');

        watermarkInputHidden.type = 'hidden';
        watermarkInputHidden.name = 'watermark_text';

        watermarkInputHidden.value =
          licenseSelect.value === 'copyright'
            ? watermarkInput.value.trim()
            : '';

        form.appendChild(watermarkInputHidden);


        /*
        * Ahora sí enviamos el formulario
        * al controller.
        */
        form.submit();

      } catch (error) {

        console.error(error);

        alert('No se pudieron preparar las imágenes.');

        publishButton.disabled = false;

        publishButton.innerHTML = `
          <i class="bi bi-cloud-upload me-2"></i>
          Publicar fotografía
        `;

      }

    });

