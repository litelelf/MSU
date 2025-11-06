const ipInput = document.getElementById('ipInput');
const maskInput = document.getElementById('maskInput');
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





function isValidMask(mask) {
    if (mask.startsWith('/')) { 
        const numMask = mask.slice(1);
        const num = parseInt(numMask); 
        if (isNaN(num) || num < 0 || num > 32) { 
            return false;
        }
        return true; 
    } else {
        const parts = mask.split('.');
        if (parts.length !== 4) return false;
        
        for (let i = 0; i < parts.length; i++) {
            const num = parseInt(parts[i]);
            if (isNaN(num) || num < 0 || num > 255) {
                return false;
            }
        }
        return true;
    }
}





//255.254.0.0
function calculateNetwork(ip, mask) {    
    const parts = ip.split('.').map(Number); 

    let binaryMASK = []; // массив с двоичным представлением маски
    let maskBits = ''; // строка с двоичным предствалением маски
    let maskname = '';

    if (parts[0] >= 0 && parts[0] <= 127) {
        maskname = 'Класс А';
    } else if (parts[0] >= 128 && parts[0] <= 191) {
        maskname = 'Класс В';
    } else if (parts[0] >= 192 && parts[0] <= 223) {
        maskname = 'Класс С';
    } else {
        maskname = 'Класс не входит в A,B или С';
    }

    if (mask.startsWith('/')) { // маска как число в 2ичную систему
        const numMask = parseInt(mask.slice(1));
        for(let i = 0; i < numMask; i++) {
            maskBits += '1'; 
        }
        maskBits = maskBits.padEnd(32, '0');
    
        binaryMASK[0] = maskBits.slice(0, 8);
        binaryMASK[1] = maskBits.slice(8, 16);
        binaryMASK[2] = maskBits.slice(16, 24);
        binaryMASK[3] = maskBits.slice(24, 32);
    }
    else {  // Маска как ip в 2ичную систему

        const maskParts = mask.split('.').map(Number);

        // Переводим маску в двоичную систему
        binaryMASK = [];
        for (let i = 0; i < 4; i++) {
            let num = maskParts[i];
            let binaryMASKStr = '';
            while (num != 0) {
                let numCeloe = Math.floor(num / 2);
                let numOstatok = num % 2;
                binaryMASKStr = numOstatok + binaryMASKStr;
                num = numCeloe;
            }
            binaryMASKStr = binaryMASKStr.padStart(8, '0');
            binaryMASK[i] = binaryMASKStr;
        }
        maskBits = binaryMASK.join('');
    }

    // Переводим IP в двоичную систему
    const binaryIP = [];
    for (let i = 0; i < 4; i++) {
        let num = parts[i];
        let binaryIPStr = '';
        while (num != 0) {
            let numCeloe = Math.floor(num / 2);
            let numOstatok = num % 2;
            binaryIPStr = numOstatok + binaryIPStr;
            num = numCeloe;
        }
        binaryIPStr = binaryIPStr.padStart(8, '0');
        binaryIP[i] = binaryIPStr;
    }
    const ipBits = binaryIP.join('');

    // Побитовое AND
    let answer = [];
    for (let i = 0; i < ipBits.length; i++) {
        answer[i] = (ipBits[i] === '1' && maskBits[i] === '1') ? '1' : '0';
    }

    // считаем биты в маске
    let oneinmask = 0;
    for (let i = 0; i < maskBits.length; i++) {
        if (maskBits[i] == '1') oneinmask += 1;
    }

    // сеть
    const network = [
        parseInt(answer.slice(0, 8).join(''), 2),
        parseInt(answer.slice(8, 16).join(''), 2),
        parseInt(answer.slice(16, 24).join(''), 2),
        parseInt(answer.slice(24, 32).join(''), 2)
    ];

    //номер узла
    let ipfornomer = [...ipBits];
    let nomeruzla = ipfornomer.join('').slice(oneinmask, 32);
    nomeruzla = nomeruzla.padStart(32, '0');

    const nomeruzla1 = [
        parseInt(nomeruzla.slice(0, 8), 2),
        parseInt(nomeruzla.slice(8, 16), 2),
        parseInt(nomeruzla.slice(16, 24), 2),
        parseInt(nomeruzla.slice(24, 32), 2)
    ];

    // broadcast
    let broadcastst = ipBits;
    broadcastst = broadcastst.slice(0, oneinmask);
    broadcastst = broadcastst.padEnd(32, '1');

    const broadcast = [
        parseInt(broadcastst.slice(0, 8), 2),
        parseInt(broadcastst.slice(8, 16), 2),
        parseInt(broadcastst.slice(16, 24), 2),
        parseInt(broadcastst.slice(24, 32), 2)
    ];

    // диапазон ip адресов
    const one = [...network];
    const two = [...broadcast];
    const range2 = one.join('.') + ' — ' + two.join('.');

    return {
        range2: range2,
        nomeruzla1: nomeruzla1.join('.'),
        network: network.join('.'),
        binaryIP: binaryIP,
        binaryMASK: binaryMASK,
        ipBits: ipBits,
        maskBits: maskBits,
        answer: answer,
        broadcastst: broadcastst,
        oneinmask: oneinmask,
        maskname: maskname
    };
}







calculateButton.addEventListener('click', function() {
    const ip = ipInput.value.trim();
    const mask = maskInput.value.trim();
    const task = vibor.value;

    if (!ip || !mask || !task) {
        answer.textContent = 'Заполните все поля!';
        return;
    }
    if (!isValidIP(ip)) {
        answer.textContent = 'Неправильный IP-адрес!';
        return;
    }
    if (!isValidMask(mask)) {
        answer.textContent = 'Неправильная маска!';
        return;
    }

    const result = calculateNetwork(ip, mask);

    if (task === 'ipaddress') {
        answer.textContent = `Диапазон IP-адресов: ${result.range2}`;
        expl.innerHTML = [
            `<b>Класс IP адреса: ${result.maskname}</b>`,
            `Шаг 1: Переводим IP-адрес ${ip} в двоичную систему: ${result.binaryIP.join('.')}`,
            `Шаг 2: Переводим маску ${mask} в двоичную систему: ${result.binaryMASK.join('.')}`,
            `Шаг 3: Выполняем побитовое AND между IP и маской:`,
            `        IP:   ${result.ipBits}`,
            `        Маска: ${result.maskBits}`,
            `        Сеть:  ${result.answer.join('')}`,
            `Шаг 4: Переводим результат побитового AND в десятичный вид: ${result.network}`,
            `Шаг 5: Находим широковещательный адрес: берем первые ${result.oneinmask} битов IP (${result.ipBits.slice(0, result.oneinmask)}) и заполняем оставшиеся единицами:`,
            `        Широковещательный (двоичный): ${result.broadcastst}`,
            `        Широковещательный (десятичный): ${result.range2.split(' — ')[1]}`,
            `Шаг 6: Диапазон IP-адресов: от ${result.network} до ${result.range2.split(' — ')[1]}`
        ].join('<br>');
    } else if (task === 'knot') {
        answer.textContent = `Номер узла: ${result.nomeruzla1}`;
        expl.innerHTML = [
            `Шаг 1: Переводим IP-адрес ${ip} в двоичную систему: ${result.binaryIP.join('.')}`,
            `Шаг 2: Переводим маску ${mask} в двоичную систему: ${result.binaryMASK.join('.')}`,
            `Шаг 3: Считаем количество единиц в маске: ${result.oneinmask}`,
            `Шаг 4: Берем биты IP-адреса после первых ${result.oneinmask} битов (то есть биты узла): ${result.ipBits.slice(result.oneinmask, 32)}`,
            `Шаг 5: Заполняем оставшиеся биты нулями до 32 бит: ${result.ipBits.slice(result.oneinmask, 32).padStart(32, '0')}`,
            `Шаг 6: Переводим результат в десятичный вид, разбивая на октеты: ${result.nomeruzla1}`
        ].join('<br>');
    } else if (task === 'net') {
        answer.textContent = `Номер сети: ${result.network}`;
        expl.innerHTML = [
            `Шаг 1: Переводим IP-адрес ${ip} в двоичную систему: ${result.binaryIP.join('.')}`,
            `Шаг 2: Переводим маску ${mask} в двоичную систему: ${result.binaryMASK.join('.')}`,
            `Шаг 3: Выполняем побитовое AND между IP и маской:`,
            `        IP:   ${result.ipBits}`,
            `        Маска: ${result.maskBits}`,
            `        Сеть:  ${result.answer.join('')}`,
            `Шаг 4: Переводим результат побитового AND в десятичный вид: ${result.network}`
        ].join('<br>');
    }
});






resetButton.addEventListener('click', function() {
    ipInput.value = '';
    maskInput.value = '';
    vibor.value = '';
    answer.textContent = '';
    expl.textContent = '';
});