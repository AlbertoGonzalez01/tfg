document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const file = document.getElementById('photo').files[0];
  const caption = document.getElementById('caption').value;
  const userId = localStorage.getItem('userId'); 

  if (!file || !caption || !userId) {
    return alert('Faltan datos');
  }

  // 1. Subir imagen a Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'preset_publico'); // Reemplaza con tu preset real

  try {
    const cloudRes = await fetch('https://api.cloudinary.com/v1_1/tfgalberto/image/upload', {
      method: 'POST',
      body: formData
    });

    const cloudData = await cloudRes.json();

    if (!cloudData.secure_url) {
    console.error('❌ Error: No se recibió secure_url');
    console.log('Respuesta de Cloudinary:', cloudData);
    return alert('No se pudo subir la imagen a Cloudinary');
}
    //console.log(cloudData);
    const imageUrl = cloudData.secure_url;

    // 2. Enviar info al backend
    const res = await fetch('https://backend-tfg-9u97.onrender.com/api/photos/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, caption, userId })
    });

    const result = await res.json();
    alert(result.msg);
  } catch (err) {
    console.error('Error al subir imagen:', err);
    alert('Error al subir la imagen');
  }
});

async function cargarFotos() {
  const userId = localStorage.getItem('userId');
  if (!userId) return;
    alert("no has iniciado sesión");
  try {
    const res = await fetch(`https://backend-tfg-9u97.onrender.com/api/photos/${userId}`);
    const fotos = await res.json();

    const container = document.getElementById('photosContainer');
    container.innerHTML = '';

    fotos.forEach(foto => {
      const div = document.createElement('div');
      div.style.margin = '20px';
      div.innerHTML = `
        <img src="${foto.imageUrl}" alt="foto" style="max-width: 300px; display: block;" />
        <p>${foto.caption || ''}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error al cargar fotos:', err);
  }
}

document.addEventListener('DOMContentLoaded', cargarFotos);

document.getElementById('logout').addEventListener('click', function () {
  // Elimina el token y el userId del almacenamiento local
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  
  // Opcional: limpiar todo el localStorage
  // localStorage.clear();
  
  // Redirige a la página de inicio de sesión (por ejemplo, index.html)
  window.location.href = 'login.html';
});
