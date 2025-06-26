// Configuración base de la API
// *** Esto YA debería estar apuntando a tu backend en puerto 3000 ***
const API_BASE_URL = 'http://localhost:3000/api/auth/login'; 

/**
 * fetchApi: Función auxiliar para realizar peticiones HTTP a tu backend.
 * @param {string} endpoint - La parte del URL después de API_BASE_URL (ej. '/login', '/users').
 * @param {string} method - El método HTTP (GET, POST, PUT, DELETE).
 * @param {object} data - El cuerpo de la solicitud para POST/PUT.
 * @returns {Promise<object>} - Una promesa que resuelve con los datos JSON de la respuesta.
 * @throws {Error} - Lanza un error si la solicitud no es exitosa o la respuesta no es JSON.
 */
const fetchApi = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Si tu backend usa tokens de sesión o JWT, los enviarías aquí:
      // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: data ? JSON.stringify(data) : null,
  };

  console.log(`[API Request] ${method} ${url}`, { data });

  try {
    const response = await fetch(url, options);
    console.log(`[API Response] Status: ${response.status} for ${method} ${url}`);

    const text = await response.text();
    console.log(`[API Raw Text] for ${endpoint}:`, text);

    if (!response.ok) {
      let errorData;
      try {
        errorData = text ? JSON.parse(text) : { message: `Error ${response.status}: ${response.statusText} (Respuesta vacía o no JSON)` };
      } catch (parseError) {
        errorData = { message: `Error ${response.status}: ${response.statusText}. Respuesta no JSON: ${text}` };
        console.error(`[API Parse Error] No se pudo parsear el texto de error como JSON para ${endpoint}:`, parseError);
      }
      throw new Error(errorData.message || `Error desconocido en la solicitud a ${url}`);
    }

    try {
      return text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error(`[API Parse Error] Error al parsear JSON de respuesta exitosa para ${endpoint}:`, parseError, `Texto recibido: "${text}"`);
      throw new Error(`Respuesta inválida del servidor: el contenido no es JSON para ${endpoint}.`);
    }

  } catch (error) {
    console.error(`[API General Error] Error en la llamada a la API ${endpoint}:`, error);
    throw error;
  }
};

export default fetchApi;
