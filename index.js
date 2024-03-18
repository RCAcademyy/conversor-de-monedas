// Obtener el elemento select de la moneda
const coinSelect = document.getElementById('moneda');
// Obtener el elemento select de las criptomonedas
const cryptoCoinsSelect = document.getElementById('criptomonedas');
// Obtener el formulario
const form = document.getElementById('formulario');


// Cuando el contenido ha sido cargado en el DOM, ejecutar estas acciones
document.addEventListener('DOMContentLoaded', () => {
  // Verificar las monedas disponibles al cargar la página
  checkCoins(); 
  // Agregar un evento de envío al formulario para manejar la conversión
  form.addEventListener('submit', makeConversion); 
  // Agregar un evento de cambio al seleccionar una moneda
  coinSelect.addEventListener('change', readValue); 
  // Agregar un evento de cambio al seleccionar una criptomoneda
  cryptoCoinsSelect.addEventListener('change', readValue);  
});


// Objeto de búsqueda inicial
const objSearch = {
  coin: '', // Moneda seleccionada
  cryptoCurrency: '' // Criptomoneda seleccionada
}


// Obtener las monedas disponibles desde la API
const getCoins = cryptoCurrency => new Promise (resolve => {
  resolve(cryptoCurrency);
});


// Función para leer el valor seleccionado
function readValue(e) {
  objSearch[e.target.name] = e.target.value;
}


// Verificar las monedas disponibles y llenar el select de criptomonedas
async function checkCoins() {

  // URL de la API para obtener las criptomonedas más populares
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

  try {
    // Realizar la solicitud a la API
    const response = await fetch(url);
    // Obtener los datos de respuesta en formato JSON
    const result = await response.json();
    // Obtener las criptomonedas disponibles
    const cryptoCurrency = await getCoins(result.Data);

    // Llenar el select de criptomonedas con las opciones disponibles
    selectCryptoCurrency(cryptoCurrency);

  } catch (error) {
    console.log(error);
  }

}


// Llenar el select de criptomonedas con las opciones disponibles
function selectCryptoCurrency(coins) {

  coins.forEach(coin => {
    // Obtener el nombre completo y el símbolo de la criptomoneda
    const {CoinInfo: {FullName, Name}} = coin;
    // Crear una opción para el select de criptomonedas
    const option = document.createElement('option');
    option.value = Name;
    option.textContent = FullName;
    // Agregar la opción al select de criptomonedas
    cryptoCoinsSelect.appendChild(option);
  });

}


// Realizar la conversión al hacer submit en el formulario
function makeConversion(e) {

  e.preventDefault();
  // Obtener la moneda y la criptomoneda seleccionadas
  const {coin, cryptoCurrency} = objSearch;
  // Verificar si se han seleccionado ambos campos
  if (coin === '' || cryptoCurrency === '') {
    // Mostrar una alerta si faltan campos por completar
    showAlert('¡Upps! los campos estan vacios');
    return;
  }

  // Realizar la conversión consultando a la API
  fetchApiConvert();

}


// Mostrar una alerta
function showAlert(message) {
  // Obtener el elemento de alerta
  const alertDiv = document.querySelector('.alert');
  // Mostrar el mensaje de alerta en el elemento
  alertDiv.innerHTML = message;
}


// Realizar la solicitud de conversión a la API
async function fetchApiConvert() {
  // Obtener la moneda y la criptomoneda seleccionadas
  const {coin, cryptoCurrency} = objSearch;
  // Mostrar un indicador de carga
  showLoading();
  // URL de la API para obtener la conversión
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoCurrency}&tsyms=${coin}`;

  try {
    // Realizar la solicitud a la API
    const response = await fetch(url);
    // Obtener los datos de respuesta en formato JSON
    const result = await response.json();
    // Llenar el popup con los datos de la conversión
    fillpopup(result.DISPLAY[cryptoCurrency][coin]);

  } catch (error) {
    console.log(error);
  }
}


// Llenar el popup con la información de la conversión
function fillpopup(response) {
  // Extraer los datos necesarios de la respuesta
  const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = response;

  // Limpiar el contenido actual del popup
  clearPopup();

  // Crear elementos HTML para mostrar la información de la conversión
  const price = document.createElement('div');
  price.classList.add('info');
  price.innerHTML = `<strong>Precio:</strong> <span>${PRICE}</span>`;

  const hightPrice = document.createElement('div');
  hightPrice.classList.add('info');
  hightPrice.innerHTML = `<strong>Precio más alto:</strong> <span>${HIGHDAY}</span>`;

  const lowPrice = document.createElement('div');
  lowPrice.classList.add('info');
  lowPrice.innerHTML = `<strong>Precio más bajo:</strong> <span>${LOWDAY}</span>`;

  const lastHour = document.createElement('div');
  lastHour.classList.add('info');
  lastHour.innerHTML = `<strong>Variación últimas 24 horas:</strong> <span>${CHANGEPCT24HOUR}</span>`;

  const lastUpdate = document.createElement('div');
  lastUpdate.classList.add('info');
  lastUpdate.innerHTML = `<strong>Última actualización:</strong> <span>${LASTUPDATE}</span>`;

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Cerrar';
  closeButton.id = 'closeBtn';
  closeButton.addEventListener('click', function() {
    var popup = document.getElementById('popup');
    popup.classList.toggle('active');
    var overlay = document.getElementById('overlay');
    overlay.classList.toggle('active');
  });

  // Agregar los elementos al popup
  popup.appendChild(price);
  popup.appendChild(hightPrice);
  popup.appendChild(lowPrice);
  popup.appendChild(lastHour);
  popup.appendChild(lastUpdate);
  popup.appendChild(closeButton);
}


// Limpiar el contenido del popup
function clearPopup() {
  // Eliminar todos los hijos del popup
  while(popup.firstChild) {
    popup.removeChild(popup.firstChild);
  }
}


// Mostrar un indicador de carga
function showLoading() {
  // Limpiar el contenido actual del popup
  clearPopup();
  // Crear un spinner de carga
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  // Agregar el spinner al popup
  spinner.innerHTML = `
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>`;

  popup.appendChild(spinner);
}


// Alternar la visibilidad del popup y el overlay
function toggle() {
  // Obtener el popup y el overlay
  var popup = document.getElementById('popup');
  var overlay = document.getElementById('overlay');
  // Alternar las clases para mostrar u ocultar el popup y el overlay
  popup.classList.toggle('active');
  overlay.classList.toggle('active');
}


// Agregar un evento de click al botón de cerrar popup
document.getElementById('closeBtn').addEventListener('click', toggle);