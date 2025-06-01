document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    console.log('Formulario enviado');

    const user = document.getElementById('user').value.trim(); 
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    if (!user || !email || !password || !confirmPassword) {
      alert('Por favor completa todos los campos.');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
  
    try {
        console.log({ user, email, password });
      const res = await fetch('https://backend-tfg-9u97.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, email, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert(data.msg);
        window.location.href = 'login.html'; // Redirige al login
        //alert('Error al conectar con el servidor. Por favor, verifica tu conexión o intenta más tarde.');
        alert(data.msg);
      }
    } catch (error) {
      alert('Error al conectar con el servidor.');
      console.error(error);
    }
  });