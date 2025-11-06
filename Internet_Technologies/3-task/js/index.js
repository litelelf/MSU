const ipInput = document.getElementById('ipInput');
const vibor = document.getElementById('vibor');
const calculateButton = document.getElementById('yes');
const resetButton = document.getElementById('no');
const answer = document.getElementById('answer');
const expl = document.getElementById('expl');




function isValidIP(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;

    for (let i = 0; i < parts.length; i++) {
        const num = parseInt(parts[i]);
        if (isNaN(num) || num < 0 || num > 255) {
            return false;
        }
    }
    return true;
}






function calculateNetwork(ip) {
    const parts = ip.split('.').map(Number);

    // Ищем маску по классу
    let maskname = '';
    let maskPartsSTR = '';
    if (parts[0] >= 0 && parts[0] <= 127) {
        maskPartsSTR = '255.0.0.0';
        maskname = 'Класс А';
    } else if (parts[0] >= 128 && parts[0] <= 191) {
        maskPartsSTR = '255.255.0.0';
        maskname = 'Класс В';
    } else if (parts[0] >= 192 && parts[0] <= 223) {
        maskPartsSTR = '255.255.255.0';
        maskname = 'Класс С';
    } else {
        throw new Error('IP-адрес принадлежит классу D или E, которые не поддерживаются в этой задаче.');
    }

    const maskParts = maskPartsSTR.split('.').map(Number);

    // Переводим IP в двоичную систему
    const binaryIP = parts.map(num => num.toString(2).padStart(8, '0'));

    // Переводим маску в двоичную систему
    const binaryMASK = maskParts.map(num => num.toString(2).padStart(8, '0'));

    // Побитовое AND
    const ipBits = binaryIP.join('');
    const maskBits = binaryMASK.join('');
    let networkBits = '';
    for (let i = 0; i < ipBits.length; i++) {
        networkBits += (ipBits[i] === '1' && maskBits[i] === '1') ? '1' : '0';
    }

    // Считаем биты в маске
    let oneinmask = 0;
    for (let i = 0; i < maskBits.length; i++) {
        if (maskBits[i] === '1') oneinmask += 1;
    }

    // Сеть
    const network = [
        parseInt(networkBits.slice(0, 8), 2),
        parseInt(networkBits.slice(8, 16), 2),
        parseInt(networkBits.slice(16, 24), 2),
        parseInt(networkBits.slice(24, 32), 2)
    ];

    // Номер узла
    let nomeruzla = ipBits.slice(oneinmask, 32).padStart(32, '0');
    const nomeruzla1 = [
        parseInt(nomeruzla.slice(0, 8), 2),
        parseInt(nomeruzla.slice(8, 16), 2),
        parseInt(nomeruzla.slice(16, 24), 2),
        parseInt(nomeruzla.slice(24, 32), 2)
    ];

    // Широковещательный адрес
    let broadcastst = ipBits.slice(0, oneinmask).padEnd(32, '1');
    const broadcast = [
        parseInt(broadcastst.slice(0, 8), 2),
        parseInt(broadcastst.slice(8, 16), 2),
        parseInt(broadcastst.slice(16, 24), 2),
        parseInt(broadcastst.slice(24, 32), 2)
    ];

    // Диапазон IP-адресов
    const range2 = network.join('.') + ' — ' + broadcast.join('.');

    return {
      range2: range2,
      maskname: maskname,
      binaryIP: binaryIP,
      binaryMASK: binaryMASK,
      oneinmask: oneinmask,
      nomeruzla1: nomeruzla1.join('.'),
      network: network.join('.'),
      networkBits: networkBits,
      broadcastBits: broadcastst,
      ipBits: ipBits,
      maskPartsSTR: maskPartsSTR 
  };
}







calculateButton.addEventListener('click', function() {
  const ip = ipInput.value.trim();
  const task = vibor.value;

  if (!ip || !task) {
      answer.textContent = 'Заполните все поля!';
      return;
  }
  if (!isValidIP(ip)) {
      answer.textContent = 'Неправильный IP-адрес!';
      return;
  }

  const result = calculateNetwork(ip);

  if (task === 'ipaddress') { // Находим диапазон
      answer.textContent = `Диапазон IP-адресов: ${result.range2}`;
      expl.innerHTML = [
          `Шаг 1: Определяем класс IP-адреса по первому октету (${ip.split('.')[0]}): ${result.maskname}`,
          `Шаг 2: Находим стандартную маску для ${result.maskname}: ${result.binaryMASK.join('.')} (в десятичном виде: ${result.maskPartsSTR})`, // Исправлено: maskPartsSTR → result.maskPartsSTR
          `Шаг 3: Переводим IP-адрес ${ip} в двоичную систему: ${result.binaryIP.join('.')}`,
          `Шаг 4: Выполняем побитовое AND между IP и маской:`,
          `        IP:   ${result.ipBits}`,
          `        Маска: ${result.binaryMASK.join('')}`,
          `        Сеть:  ${result.networkBits}`,
          `Шаг 5: Переводим результат побитового AND обратно в десятичный вид: ${result.network}`,
          `Шаг 6: Находим широковещательный адрес: берем первые ${result.oneinmask} битов IP (${result.ipBits.slice(0, result.oneinmask)}) и заполняем оставшиеся единицами:`,
          `        Широковещательный (двоичный): ${result.broadcastBits}`,
          `        Широковещательный (десятичный): ${result.range2.split(' — ')[1]}`,
          `Шаг 7: Диапазон IP-адресов: от ${result.network} до ${result.range2.split(' — ')[1]}`
      ].join('<br>');
  } else if (task === 'knot') { // Находим номер узла
      answer.textContent = `Номер узла: ${result.nomeruzla1}`;
      expl.innerHTML = [
          `Шаг 1: Определяем класс IP-адреса по первому октету (${ip.split('.')[0]}): ${result.maskname}`,
          `Шаг 2: Находим стандартную маску для ${result.maskname}: ${result.binaryMASK.join('.')} (в десятичном виде: ${result.maskPartsSTR})`, // Исправлено: maskPartsSTR → result.maskPartsSTR
          `Шаг 3: Переводим IP-адрес ${ip} в двоичную систему: ${result.binaryIP.join('.')}`,
          `Шаг 4: Считаем количество единиц в маске: ${result.oneinmask}`,
          `Шаг 5: Берем биты IP-адреса после первых ${result.oneinmask} битов (то есть биты узла): ${result.ipBits.slice(result.oneinmask, 32)}`,
          `Шаг 6: Заполняем оставшиеся биты нулями до 32 бит: ${result.ipBits.slice(result.oneinmask, 32).padEnd(32, '0')}`,
          `Шаг 7: Переводим результат в десятичный вид, разбивая на октеты: ${result.nomeruzla1}`
      ].join('<br>');
  } else if (task === 'net') { // Находим номер сети
      answer.textContent = `Номер сети: ${result.network}`;
      expl.innerHTML = [
          `Шаг 1: Определяем класс IP-адреса по первому октету (${ip.split('.')[0]}): ${result.maskname}`,
          `Шаг 2: Находим стандартную маску для ${result.maskname}: ${result.binaryMASK.join('.')} (в десятичном виде: ${result.maskPartsSTR})`, // Исправлено: maskPartsSTR → result.maskPartsSTR
          `Шаг 3: Переводим IP-адрес ${ip} в двоичную систему: ${result.binaryIP.join('.')}`,
          `Шаг 4: Выполняем побитовое AND между IP и маской:`,
          `        IP:   ${result.ipBits}`,
          `        Маска: ${result.binaryMASK.join('')}`,
          `        Сеть:  ${result.networkBits}`,
          `Шаг 5: Переводим результат побитового AND в десятичный вид: ${result.network}`
      ].join('<br>');
  }
});








resetButton.addEventListener('click', function() {
  ipInput.value = '';
  vibor.value = '';
  answer.textContent = '';
  expl.textContent = '';
});
