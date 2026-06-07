const imageFile = document.getElementById('imageFiles');
const imagesContainer = document.getElementById('imagesContainer');
const postForm= document.getElementById('postForm');

imageFile.addEventListener('change',function(){
    imagesContainer.innerHTML='';

    const files = Array.from(imageFile.files);

    files.forEach((file,index)=>{
        const reader =new FileReader();
        reader.onload=function(){
            const div= document.createElement('div');
            div.classList.add('border','p-2','mb-2');

            div.innerHTML=`<p>Image${index + 1}</p>
            <input type="hidden" name="image_base64" value="${reader.result}">
            <input type="hidden" name="mime_type" value="${file.type}">
            
            
            <label>Licencia</label>
            <select class="form-control mb-2" name="license" required > 
             <option value= "free">sin copyright </option>
             <option value="copyright">ccon copyright</option>
             </select>
             
             <label>texto marca de agua </label>
             <input class="form-control mb-2" type="text" name="watermark_text"> `;

             imagesContainer.appendChild(div);

        }
        reader.readAsDataURL(file)


    })

});
 postForm.addEventListener('submit',function (event){
    const hiddenImages=document.querySelectorAll('input[name="image_base64"]');

    if(hiddenImages.length===0){
        event.preventDefault();
        alert('debe seleccionar al menos una imagen');
    }
 })