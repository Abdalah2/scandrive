const apiBase = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/api` : '/api';

async function fetchJson(path) {
  const response = await fetch(`${apiBase}${path}`);

  if (!response.ok) {
    throw new Error(`Erreur de chargement de ${path} : ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getCars() {
  return fetchJson('/cars.json');
}

export async function getCarById(id) {
  const cars = await getCars();
  return cars.find((car) => car.id === id) || null;
}

export async function getUsers() {
  return fetchJson('/users.json');
}

export async function getAgencies() {
  return fetchJson('/agences.json');
}

export async function getRendezvous() {
  return fetchJson('/rendezvous.json');
}

export async function getMessages() {
  return fetchJson('/messages.json');
}

export async function getStaticDatabase() {
  const [cars, users, agencies, rendezvous, messages] = await Promise.all([
    getCars(),
    getUsers(),
    getAgencies(),
    getRendezvous(),
    getMessages(),
  ]);

  return { cars, users, agencies, rendezvous, messages };
}
