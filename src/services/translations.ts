// Mismo diccionario exacto de src/app/services/translation.service.ts
// en baihuart-app, convertido a un módulo + hook de React.
// Persistencia con AsyncStorage en vez de localStorage.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback } from 'react';

export const traducciones: Record<string, Record<string, string>> = {
    
    // ================= ESPAÑOL =================
    es: {
      // Navbar
      "nav-tienda": "Tienda",
      "nav-galeria": "Galería",
      "nav-ofertas": "Ofertas",
      "buscar-placeholder": "Buscar productos...",
      
      // Home & Secciones
      "slogan": "Arte que cobra vida. Estilo que deja huella.",
      "sec-camisetas": "Camisetas",
      "sec-stickers": "Stickers",
      "sec-posters": "Posters",
      "sec-comentarios": "Déjanos tu comentario",
      "txt-comentarios": "Nos encantaría saber tu opinión sobre nuestro sitio web.",
      // --- GALERÍA TÍTULOS Y DESCRIPCIONES ---
"tit-baihu": "Tigre Blanco (Bái Hǔ)",
"desc-baihu": "Como una de las Cuatro Bestias Sagradas, personifica la fuerza, el coraje y la justicia.",
"tit-hebi": "Serpiente Amarilla",
"desc-hebi": "En la posición central del Feng Shui, encarna la estabilidad y el equilibrio del elemento tierra.",
"tit-fenix": "Fénix Vermellón",
"desc-fenix": "Irradia calor, luz y renovación como bestia sagrada del sur.",
"tit-burst": "Burstinatrix",
"desc-burst": "Guerrera forjada en llamas, encarna la audacia y el poder del fuego.",
"tit-hallo": "Halloween",
"desc-hallo": "Michael Myers alza su emblemático cuchillo al filo de la oscuridad otoñal.",
"tit-vader": "Darth Vader",
"desc-vader": "Vader emerge sobre un paisaje volcánico, con lava brotando a sus pies.",
"tit-vi": "VI Brawler",
"desc-vi": "Vi irrumpe en escena con sus icónicos guanteletes hextech.",
"tit-dragon": "Dragón del Rayo",
"desc-dragon": "El Dragón del Rayo despliega su cuerpo serpentino entre nubes eléctricas.",
"tit-zoro": "Roronoa Zoro",
"desc-zoro": "Tripulante y espadachín de los Mugiwara.",
"tit-sanji": "Sanji Vinsmoke",
"desc-sanji": "Tripulante y chef de los Mugiwara.",
"tit-jason": "Jason Voorhees",
"desc-jason": "El infame asesino de Crystal Lake.",
"tit-cheetara": "Cheetara",
"desc-cheetara": "Heroína de los Thundercats con velocidad sobrenatural.",
      // Galería
      "galeria-titulo": "GALERÍA DE DISEÑOS",
      "filtro-todos": "Todos",
      "filtro-espiritual": "Espiritual",
      "filtro-anime": "Anime",
      "filtro-pop": "Cultura Pop",

      // Ofertas
      "ofertas-titulo": "OFERTAS ESPECIALES",
      "ofertas-subtitulo": "Ofertas Especiales 🔥",
      "oferta1-nombre": "Pack: Camiseta + Sticker",
      "oferta2-nombre": "Pack: Poster + Pack de Stickers",
      "oferta3-nombre": "Pack: Hoodie + Poster + Sticker",

      // Formularios y Login
      "lbl-nombre": "Nombre",
      "lbl-email": "Correo electrónico",
      "lbl-telefono": "Teléfono",
      "lbl-password": "Contraseña",
      "lbl-comentario": "Comentario",
      "login-titulo": "Iniciar Sesión",
      "login-crear": "Crear Cuenta",
      "btn-entrar": "Entrar",
      "btn-registrarse": "Registrarse",
      "btn-enviar": "Enviar comentario",
      "txt-no-cuenta": "¿No tienes cuenta?",
      "txt-si-cuenta": "¿Ya tienes cuenta?",
      "link-registrate": "Regístrate aquí",
      "link-inicia": "Inicia sesión aquí",

      // Carrito y Botones
      "carrito-titulo": "Tu Carrito",
      "carrito-vacio-titulo": "¿Tan vacío? 👻",
      "carrito-vacio-sub": "El arte te está esperando. No dejes tu estilo en blanco.",
      "btn-explorar": "Explorar la Tienda",
      "btn-agregar": "Agregar al carrito",
      "btn-eliminar": "Eliminar",
      "btn-vaciar": "Vaciar Carrito",
      "txt-total": "Total",
      "lbl-precio": "Precio",
      "lbl-cantidad": "Cantidad",
      "lbl-subtotal": "Subtotal",
      "noti-agregado": "se agregó al carrito",

      // --- PRODUCTOS (NOMBRES PARA EL CARRITO) ---
      // Camisetas
      "prod-cam-vi": "Camiseta VI Brawler",
      "prod-cam-tigre": "Camiseta Tigre Blanco",
      "prod-cam-dragon": "Camiseta Dragón Azul",
      "prod-cam-cobra": "Camiseta Cobra Amarilla",
      "prod-cam-yugioh": "Camiseta Yugioh",
      // Stickers
      "prod-stick-fenix": "Sticker Fénix de Fuego",
      "prod-stick-thunder": "Sticker Dragón del Trueno",
      "prod-stick-iron": "Sticker Tigre de Hierro",
      "prod-stick-stone": "Sticker Cobra de Piedra",
      // Posters
      "prod-post-burst": "Póster E.Hero Burstinatrix",
      "prod-post-vi": "Póster VI Brawler",
      "prod-post-vader": "Póster Darth Vader",
      "prod-post-hallo": "Póster Halloween",
      "prod-post-cobra": "Póster Cobra Amarilla",
      "prod-post-tigre": "Póster Tigre Blanco",
      "prod-post-dragon": "Póster Dragón Azul",
      "prod-post-fenix": "Póster Fénix Rojo"
    },

    // ================= INGLÉS =================
    en: {
      // Navbar
      "nav-tienda": "Shop",
      "nav-galeria": "Gallery",
      "nav-ofertas": "Offers",
      "buscar-placeholder": "Search products...",

      // Home & Sections
      "slogan": "Art that comes to life. Style that leaves a mark.",
"btn-explorar": "Explore shop" ,
      "sec-camisetas": "T-Shirts",
      "sec-stickers": "Stickers",
      "sec-posters": "Posters",
      "sec-comentarios": "Leave us a comment",
      "txt-comentarios": "We would love to know your opinion about our website.",

      // Gallery
      "galeria-titulo": "DESIGNS GALLERY",
      "filtro-todos": "All",
      "filtro-espiritual": "Spiritual",
      "filtro-anime": "Anime",
      "filtro-pop": "Pop Culture", // --- GALLERY TITLES & DESCRIPTIONS ---
"tit-baihu": "White Tiger (Bái Hǔ)",
"desc-baihu": "As one of the Four Sacred Beasts, it personifies strength, courage, and justice.",
"tit-hebi": "Yellow Serpent",
"desc-hebi": "In the central Feng Shui position, it embodies stability and earth element balance.",
"tit-fenix": "Vermilion Phoenix",
"desc-fenix": "Radiates heat, light, and renewal as the sacred beast of the South.",
"tit-burst": "Burstinatrix",
"desc-burst": "A warrior forged in flames, embodying boldness and the power of fire.",
"tit-hallo": "Halloween",
"desc-hallo": "Michael Myers raises his iconic knife on the edge of autumnal darkness.",
"tit-vader": "Darth Vader",
"desc-vader": "Vader emerges over a volcanic landscape, lava flowing at his feet.",
"tit-vi": "VI Brawler",
"desc-vi": "Vi bursts onto the scene with her iconic hextech gauntlets.",
"tit-dragon": "Thunder Dragon",
"desc-dragon": "The Thunder Dragon unfurls its serpentine body amidst electric clouds.",
"tit-zoro": "Roronoa Zoro",
"desc-zoro": "Crewmate and swordsman of the Straw Hats.",
"tit-sanji": "Sanji Vinsmoke",
"desc-sanji": "Crewmate and chef of the Straw Hats.",
"tit-jason": "Jason Voorhees",
"desc-jason": "The infamous killer of Crystal Lake.",
"tit-cheetara": "Cheetara",
"desc-cheetara": "Thundercats heroine with supernatural speed.",

      // Offers
      "ofertas-titulo": "SPECIAL OFFERS",
      "ofertas-subtitulo": "Special Deals 🔥",
      "oferta1-nombre": "Pack: T-Shirt + Sticker",
      "oferta2-nombre": "Pack: Poster + Sticker Pack",
      "oferta3-nombre": "Pack: Hoodie + Poster + Sticker",

      // Forms & Login
      "lbl-nombre": "Name",
      "lbl-email": "Email",
      "lbl-telefono": "Phone",
      "lbl-password": "Password",
      "lbl-comentario": "Comment",
      "login-titulo": "Login",
      "login-crear": "Create Account",
      "btn-entrar": "Login",
      "btn-registrarse": "Register",
      "btn-enviar": "Send comment",
      "txt-no-cuenta": "Don't have an account?",
      "txt-si-cuenta": "Already have an account?",
      "link-registrate": "Register here",
      "link-inicia": "Login here",

      // Cart & Buttons
      "carrito-titulo": "Your Cart",
      "carrito-vacio-titulo": "So empty? 👻",
      "carrito-vacio-sub": "Art is waiting for you. Don't leave your style blank.",
      "btn-agregar": "Add to cart",
      "btn-eliminar": "Remove",
      "btn-vaciar": "Empty Cart",
      "txt-total": "Total",
      "lbl-precio": "Price",
      "lbl-cantidad": "Quantity",
      "lbl-subtotal": "Subtotal",
      "noti-agregado": "was added to the cart",

      // --- PRODUCTS ---
      // T-Shirts
      "prod-cam-vi": "VI Brawler T-Shirt",
      "prod-cam-tigre": "White Tiger T-Shirt",
      "prod-cam-dragon": "Blue Dragon T-Shirt",
      "prod-cam-cobra": "Yellow Cobra T-Shirt",
      "prod-cam-yugioh": "Yugioh T-Shirt",
      // Stickers
      "prod-stick-fenix": "Fire Phoenix Sticker",
      "prod-stick-thunder": "Thunder Dragon Sticker",
      "prod-stick-iron": "Iron Tiger Sticker",
      "prod-stick-stone": "Stone Cobra Sticker",
      // Posters
      "prod-post-burst": "E.Hero Burstinatrix Poster",
      "prod-post-vi": "VI Brawler Poster",
      "prod-post-vader": "Darth Vader Poster",
      "prod-post-hallo": "Halloween Poster",
      "prod-post-cobra": "Yellow Cobra Poster",
      "prod-post-tigre": "White Tiger Poster",
      "prod-post-dragon": "Blue Dragon Poster",
      "prod-post-fenix": "Red Phoenix Poster"
    },

    // ================= PORTUGUÉS =================
    pt: {
      // Navbar
      "nav-tienda": "Loja",
      "nav-galeria": "Galeria",
      "nav-ofertas": "Ofertas",
      "buscar-placeholder": "Buscar produtos...",

      // Home & Seções
      "slogan": "Arte que ganha vida. Estilo que deixa marca.",
"btn-explorar": "Explorar loja",
      "sec-camisetas": "Camisetas",
      "sec-stickers": "Adesivos",
      "sec-posters": "Pôsteres",
      "sec-comentarios": "Deixe-nos um comentário",
      "txt-comentarios": "Adoraríamos saber sua opinião sobre nosso site.",

      // Galeria
      "galeria-titulo": "GALERIA DE DESENHOS",
      "filtro-todos": "Todos",
      "filtro-espiritual": "Espiritual",
      "filtro-anime": "Anime",
      "filtro-pop": "Cultura Pop",

      // Ofertas
      "ofertas-titulo": "OFERTAS ESPECIAIS",
      "ofertas-subtitulo": "Ofertas Especiais 🔥",
      "oferta1-nombre": "Pacote: Camiseta + Adesivo",
      "oferta2-nombre": "Pacote: Pôster + Pacote de Adesivos",
      "oferta3-nombre": "Pacote: Moletom + Pôster + Adesivo",

      // Forms & Login
      "lbl-nombre": "Nome",
      "lbl-email": "E-mail",
      "lbl-telefono": "Telefone",
      "lbl-password": "Senha",
      "lbl-comentario": "Comentário",
      "login-titulo": "Entrar",
      "login-crear": "Criar Conta",
      "btn-entrar": "Entrar",
      "btn-registrarse": "Registrar-se",
      "btn-enviar": "Enviar comentário",
      "txt-no-cuenta": "Não tem conta?",
      "txt-si-cuenta": "Já tem conta?",
      "link-registrate": "Registre-se aqui",
      "link-inicia": "Entre aqui",

      // Cart & Buttons
      "carrito-titulo": "Seu Carrinho",
      "carrito-vacio-titulo": "Tão vazio? 👻",
      "carrito-vacio-sub": "A arte está esperando por você. Não deixe seu estilo em branco.",
      "btn-agregar": "Adicionar ao carrinho",
      "btn-eliminar": "Remover",
      "btn-vaciar": "Esvaziar Carrinho",
      "txt-total": "Total",
      "lbl-precio": "Preço",
      "lbl-cantidad": "Quantidade",
      "lbl-subtotal": "Subtotal",
      "noti-agregado": "foi adicionado ao carrinho",

      // --- PRODUTOS ---
      // Camisetas
      "prod-cam-vi": "Camiseta VI Brawler",
      "prod-cam-tigre": "Camiseta Tigre Branco",
      "prod-cam-dragon": "Camiseta Dragão Azul",
      "prod-cam-cobra": "Camiseta Cobra Amarela",
      "prod-cam-yugioh": "Camiseta Yugioh",
      // Adesivos
      "prod-stick-fenix": "Adesivo Fênix de Fogo",
      "prod-stick-thunder": "Adesivo Dragão do Trovão",
      "prod-stick-iron": "Adesivo Tigre de Ferro",
      "prod-stick-stone": "Adesivo Cobra de Pedra",
      // Pôsteres
      "prod-post-burst": "Pôster E.Hero Burstinatrix",
      "prod-post-vi": "Pôster VI Brawler",
      "prod-post-vader": "Pôster Darth Vader",
      "prod-post-hallo": "Pôster Halloween",
      "prod-post-cobra": "Pôster Cobra Amarela",
      "prod-post-tigre": "Pôster Tigre Branco",
      "prod-post-dragon": "Pôster Dragão Azul",
      "prod-post-fenix": "Pôster Fênix Vermelha"
    }
  };

const CLAVE_IDIOMA = 'idiomaSeleccionado';

export function useTranslations() {
  const [idioma, setIdiomaState] = useState('es');
  const textos = traducciones[idioma];

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_IDIOMA).then((guardado) => {
      if (guardado) setIdiomaState(guardado);
    });
  }, []);

  const cambiarIdioma = useCallback((nuevoIdioma: string) => {
    AsyncStorage.setItem(CLAVE_IDIOMA, nuevoIdioma);
    setIdiomaState(nuevoIdioma);
  }, []);

  return { idioma, textos, cambiarIdioma };
}
