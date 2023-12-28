const { ethers } = require("ethers");
const path = require("path");
const { getPrivateKey, getAddressList, getRandomIntInclusive, writeFile, convertToHex, formatDateToCustomFormat } = require("./libs/utils");

//======================配置区域 START====================================
/**
 * @description 空投数量区间
 * 1. [a,b] 表示在 [a,b]闭区间内随机一个数量进行空投
 * 2. a=b时则等价于空投固定数量
 */
const drop_cnt_per_address = [1, 3];

// 空投地址最大数量，超过了则不空投了
const address_max_count = 100;

// 总最大空投数量，超过了则不空投了
const max_drop_cnt = 10000;

//======================配置区域 END======================================

const RPC_CORE = "https://rpc.coredao.org";
const provider = new ethers.JsonRpcProvider(RPC_CORE);

const fromPrivateKey = getPrivateKey();
const wallet = new ethers.Wallet(fromPrivateKey, provider);

async function airdrop() {

    // 地址列表
    const addressList = getAddressList();
    console.log(`空投地址数量: ${addressList.length}, 最大空投地址数量: ${address_max_count}`);

    // 空投成功的信息
    const dropSuccessInfo = [];

    const dropFailedInfo = [];

    // 空投总张数
    let dropCount = 0;

    for (const toAddress of addressList) {
        if (dropSuccessInfo.length > address_max_count) {
            // 超过了空投的地址最大数量
            return;
        }
        if (dropCount >= max_drop_cnt) {
            // 超过了空投的最大张数
            return;
        }
        let randCnt = getRandomIntInclusive(drop_cnt_per_address[0], drop_cnt_per_address[1]);
        const TOKEN_JSON = `data:,{"p":"core-20","op":"transfer","tick":"coco","amt":"${1000 * randCnt}"}`;
        let hexData = convertToHex(TOKEN_JSON);
        const amount = ethers.parseEther('0');
        // 构建交易对象
        try {
            // 获取当前推荐的 Gas 价格
            const feeData = await provider.getFeeData();
            const gasPrice = feeData.gasPrice;
            // 签署并发送交易
            const ts = {
                to: toAddress,
                value: amount,
                data: hexData,
                gasPrice: gasPrice
            };
            const transaction = await wallet.sendTransaction(ts);
            console.log('交易成功，交易哈希:', transaction.hash);
            // 等待交易被挖掘
            await provider.waitForTransaction(transaction.hash);
            console.log('交易已确认');
            dropSuccessInfo.push(`${toAddress}\t${randCnt}`);
            dropCount += randCnt;
            console.log(`空投 ${toAddress} 成功，张数: ${randCnt}`);
        }
        catch (error) {
            dropFailedInfo.push(`${toAddress}\t${randCnt}\t${transaction.hash}`);
            console.log('交易失败:', error);
        }
    }
    const timeFormat = formatDateToCustomFormat(Date.now());
    const dropSuccessSaveFile = path.join(__dirname, 'drop', timeFormat, 'success.txt');
    const dropFailedSaveFile = path.join(__dirname, 'drop', timeFormat, 'failed.txt');
    dropSuccessInfo.push(`空投总数${dropCount}张`);
    writeFile(dropSuccessSaveFile, dropSuccessInfo.join('\n'));
    writeFile(dropFailedSaveFile, dropFailedInfo.join('\n'));
}
airdrop();
