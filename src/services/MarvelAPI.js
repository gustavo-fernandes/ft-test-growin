import axios from 'axios';


const urlBaseMarvel = 'https://gateway.marvel.com:443/v1/public/';
const apiKey = process.env.VUE_APP_API_KEY;

export default {
    getAllCharacters: (limit, offset, callback) => {
        const urlcharacters = urlBaseMarvel + `characters?apikey=${apiKey}&limit=${limit}&offset=${offset}`;
        axios.get(urlcharacters).then((characters) => {
            if (callback) {
                callback(characters);
            }
        })
    },
    getCharacter: (id, callback) => {
        const urlcharacters = urlBaseMarvel + `characters/${id}?apikey=${apiKey}`;
        axios.get(urlcharacters).then((characters) => {
            if (callback) {
                callback(characters);
            }
        })
    },
    getCharInfo: (id, type, callback) => {
        const urlcharacters = urlBaseMarvel + `characters/${id}/${type}?apikey=${apiKey}`;
        axios.get(urlcharacters).then((characters) => {
            if (callback) {
                callback(characters);
            }
        })
    }
}