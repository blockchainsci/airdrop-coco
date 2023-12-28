const { existsSync } = require('fs');
const path = require('path');
const fs = require('fs');

function mkdirs(filepath) {
    if (fs.existsSync(filepath)) {
        return;
    }
    let lastDir = path.dirname(filepath);
    if (!fs.existsSync(lastDir)) {
        mkdirs(lastDir);
    }
    fs.mkdirSync(filepath);
}

function readFile2Str(filepath) {
    if (!fs.existsSync(filepath)) {
        throw new Error(`readFile2Str: ${filepath} not exist`);
    }
    let content = fs.readFileSync(filepath, { encoding: 'utf-8' });
    return content;
}

function readFile2Lines(filepath) {
    let content = readFile2Str(filepath);
    if (!content) {
        console.log(`readFile2Lines: ${filepath} is empty\n`);
        return [];
    }
    return content.split("\n");
}

// 获取我的私钥
function getPrivateKey() {
    const privateKeyFile = path.join(__dirname, '../assets/private.key');
    if (!existsSync(privateKeyFile)) {
        throw new Error(`${privateKeyFile} not exists`);
    }
    const privateKey = readFile2Lines(privateKeyFile)[0].trim();
    if ((privateKey.startsWith('0x') && privateKey.length !== 66)) {
        throw new Error(`privateKey format error`);
    }


    if (privateKey.startsWith('0x') && privateKey.length !== 66) {
        throw new Error(`privateKey format error`);
    } else if (!privateKey.startsWith('0x') && privateKey.length !== 64) {
        throw new Error(`privateKey format error`);
    }
    return privateKey;
}

function writeFile(filepath, content) {
    filepath = path.resolve(filepath);
    mkdirs(path.dirname(filepath));
    fs.writeFileSync(filepath, content);
}

// 获取地址列表
function getAddressList() {
    const addressFile = path.join(__dirname, '../assets/address.txt');
    const addresses = readFile2Lines(addressFile).map(address => address.trim()).filter(address => !!address);
    return addresses;
}

// 将铭文Json串转成Hex
function convertToHex(str = '') {
    const res = [];
    const { length: len } = str;
    for (let n = 0, l = len; n < l; n++) {
        const hex = Number(str.charCodeAt(n)).toString(16);
        res.push(hex);
    }
    return `0x${res.join('')}`;
}

// [a,b] 区间内随机一个整数
function getRandomIntInclusive(a, b) {
    const min = Math.ceil(a);
    const max = Math.floor(b);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDateToCustomFormat(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}


module.exports = {
    readFile2Str: readFile2Str,
    readFile2Lines: readFile2Lines,
    writeFile: writeFile,
    getPrivateKey: getPrivateKey,
    getAddressList: getAddressList,
    convertToHex: convertToHex,
    getRandomIntInclusive: getRandomIntInclusive,
    formatDateToCustomFormat: formatDateToCustomFormat
};
