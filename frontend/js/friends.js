document.addEventListener('DOMContentLoaded', cargarFriends);

const userId = localStorage.getItem('userId');

async function cargarFriends() {
  try {
    const res = await fetch(`http://localhost:5000/api/friends/${userId}`);
    const friends = await res.json();

    const container = document.getElementById('listaFriends');
    container.innerHTML = '';

    friends.forEach(friend => {
      const div = document.createElement('div');
      div.className = 'friend';
      div.innerHTML = `
        <strong>${friend.user}</strong>
        <button onclick="removeFriend('${friend._id}')">Remove</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error loading friends:', err);
  }
}

document.getElementById('btnBuscar').addEventListener('click', async () => {
  const username = document.getElementById('buscarUsuario').value.trim();
  if (!username) return alert('Introduce un nombre de usuario');

  try {
    const res = await fetch('http://localhost:5000/api/auth/friends/buscar-usuarios');
    const users = await res.json();
    const match = users.find(u => u.user === username);

    if (!match) return alert('Usuario no encontrado');
    if (match._id === userId) return alert('No puedes agregar a ti mismo como amigo');

    const yaEsAmigo = await fetch(`http://localhost:5000/api/friends/${userId}`);
    const amigosActuales = await yaEsAmigo.json();

    if (amigosActuales.some(a => a._id === match._id)) {
      return alert('Ya tienes agregado a ese usuario');
    }

    await fetch('http://localhost:5000/api/friends/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, friendId: match._id })
    });

    alert('Amigo agregado correctamente');
    cargarFriends();
  } catch (err) {
    console.error('error al añadir amigo:', err);
  }
});

async function removeFriend(friendId) {
  try {
    await fetch('http://localhost:5000/api/friends/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, friendId }) 
    });

    alert('Amigo eliminado correctamente');
    cargarFriends();
  } catch (err) {
    console.error('Error al eliminar amigo:', err);
  }
}
