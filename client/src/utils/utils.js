export function isNil(text) {
    return text === null || text === undefined || text.trim() === '';
}

export function isNilOnly(text) {
    return text === null || text === undefined;
}

export function isNotNil(text) {
    return text !== null && text !== undefined && text.trim() !== '';
}

export function isNotNilOnly(text) {
    return text !== null && text !== undefined;
}

export function isNilAndLengthMinusSix(text) {
    return text === null || text === undefined || text.trim() === '' || text.length < 6;
}

export function isNilAndLengthPlusZero(text) {
    return text === null || text === undefined || Object.keys(text).length === 0;
}

export function isNilAndLengthPlusZeroArray(text) {
    return text === null || text === undefined || text.length === 0;
}

export function generateSecureKey() {
    const array = new Uint32Array(4); // Uint32Array di lunghezza 4 x 4 byte = 16 byte
    window.crypto.getRandomValues(array); // Utilizzo di Web Crypto API per generare valori casuali sicuri
    return Array.from(array, dec => dec.toString(16).padStart(8, '0')).join(''); // Converti ogni numero a esadecimale e concatenali
};

export default function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};