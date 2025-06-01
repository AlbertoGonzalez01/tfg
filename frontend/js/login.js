document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Evita que recargue la página

  const user = document.getElementById('user').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!user || !password) {
    alert('Por favor completa todos los campos.');
    return;
  }

  try {
    //console.log(user, password);

    const res = await fetch('https://backend-tfg-9u97.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password }),
    });

    const data = await res.json();
    console.log(data)
    if (res.ok) {
      alert(data.msg);
      localStorage.setItem('userId', data.userId); // Guarda el ID del usuario
      localStorage.setItem('token', data.token); // Guarda el token
      window.location.href = 'feed.html';   // Redirige al dashboard
    } else {
      alert(data.msg); // Muestra mensaje de error del servidor
    }
  } catch (error) {
    alert('Error al conectar con el servidor. Intenta más tarde.');
    console.error(error);
  }
});