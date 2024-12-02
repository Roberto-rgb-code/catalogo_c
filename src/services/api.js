import he from 'he';

const API_URL = 'https://promocionalesenlinea.net/api';

const headers = {
    'Content-Type': 'application/json',
};

const credentials = {
    user: "GDL3099",
    password: "NKEwuUIilPPfzNOVzlQu",
};

// Función para decodificar entidades HTML
const decodeHtmlEntities = (obj) => {
    if (typeof obj === 'string') {
        return he.decode(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(decodeHtmlEntities);
    }
    if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, decodeHtmlEntities(value)])
        );
    }
    return obj;
};

// Función para obtener productos
export const fetchProducts = async () => {
    try {
        console.log('Fetching products...');
        const response = await fetch(`${API_URL}/all-products`, {
            method: 'POST',
            headers,
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Products data (raw):', data);

        // Verificar si la respuesta es exitosa
        if (data.success) {
            // Decodificar las entidades HTML y retornar los productos
            const decodedData = decodeHtmlEntities(data.response);
            console.log('Products data (decoded):', decodedData);
            return decodedData;
        }

        // Si no es exitosa, lanzar error con mensaje
        throw new Error('Error al obtener productos. No se encontró respuesta exitosa.');
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; // Re-lanzar el error para manejo posterior
    }
};

// Función para obtener existencias de productos
export const fetchStocks = async () => {
    try {
        console.log('Fetching stocks...');
        const response = await fetch(`${API_URL}/all-stocks`, {
            method: 'POST',
            headers,
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Stocks data (raw):', data);

        // Verificar si la respuesta es exitosa
        if (data.success) {
            const decodedData = decodeHtmlEntities(data.Stocks);
            console.log('Stocks data (decoded):', decodedData);
            return decodedData;
        }

        // Si no es exitosa, lanzar error con mensaje
        throw new Error('Error al obtener existencias. No se encontró respuesta exitosa.');
    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw error; // Re-lanzar el error para manejo posterior
    }
};
