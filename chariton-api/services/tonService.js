const TonWeb = require('tonweb');
require('dotenv').config();

const BN = TonWeb.utils.BN;

const toNano = TonWeb.utils.toNano;

class TonService {

    constructor() {    

        this.channelActive = false;
        const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC';
        const apiKey = process.env.TON_API_KEY;
        this.tonweb = new TonWeb(new TonWeb.HttpProvider(providerUrl, {apiKey}));
                    
    }

    async initWallets() {
        const seedA = TonWeb.utils.base64ToBytes(process.env.TON_SEED_A); 
        this.keyPairA = this.tonweb.utils.keyPairFromSeed(seedA);

        this.walletA = this.tonweb.wallet.create({
            publicKey: this.keyPairA.publicKey
        });
        this.walletAddressA = await this.walletA.getAddress();
        console.log('walletAddressA = ', this.walletAddressA.toString(true, true, true));


        const seedB = TonWeb.utils.base64ToBytes(process.env.TON_SEED_B);
        this.keyPairB = this.tonweb.utils.keyPairFromSeed(seedB);

        this.walletB = this.tonweb.wallet.create({
            publicKey: this.keyPairB.publicKey
        });
        this.walletAddressB = await this.walletB.getAddress();
        console.log('walletAddressB = ', this.walletAddressB.toString(true, true, true));
    }

    startChannel() {
        return new Promise(async(resolve, reject) => {

            if (this.channelActive) reject('Channel already active!')

            this.channelActive = true

            const balanceA = await this.tonweb.getBalance(this.walletAddressA);
            console.log('balanceA = ', (new BN(balanceA).toNumber()))
            
            const balanceB = await this.tonweb.getBalance(this.walletAddressB);
            console.log('balanceB = ', (new BN(balanceB).toNumber()))
            
            const channelInitState = {
                balanceA: toNano('10'),
                balanceB: toNano('4'), 
                seqnoA: new BN(0),
                seqnoB: new BN(0)
            };

            console.log('Init A: ', channelInitState.balanceA.toNumber(), '; Init B: ', channelInitState.balanceB.toNumber())

            const channelConfig = {
                channelId: new BN(32), 
                addressA: this.walletAddressA,
                addressB: this.walletAddressB, 
                initBalanceA: channelInitState.balanceA,
                initBalanceB: channelInitState.balanceB
            }

            const channelA = this.tonweb.payments.createChannel({
                ...channelConfig,
                isA: true,
                myKeyPair: this.keyPairA,
                hisPublicKey: this.keyPairB.publicKey,
            });
            const channelAddress = await channelA.getAddress();
            console.log('channelAddress=', channelAddress.toString(true, true, true));

            const channelB = this.tonweb.payments.createChannel({
                ...channelConfig,
                isA: false,
                myKeyPair: this.keyPairB,
                hisPublicKey: this.keyPairA.publicKey,
            });

            if ((await channelB.getAddress()).toString() !== channelAddress.toString()) {
                reject('Channels address not same');
            }


            const fromWalletA = channelA.fromWallet({
                wallet: this.walletA,
                secretKey: this.keyPairA.secretKey
            });

            const fromWalletB = channelB.fromWallet({
                wallet: this.walletB,
                secretKey: this.keyPairB.secretKey
            });


            await fromWalletA.deploy().send(toNano('0.05')); 

            console.log('Current Channel State: ', await channelA.getChannelState());
            const data = await channelA.getData();
            // console.log(data)
            console.log('balanceA = ', data.balanceA.toString())
            console.log('balanceB = ', data.balanceB.toString())

            if (data.balanceA == 0) {
                await fromWalletA
                    .topUp({coinsA: channelInitState.balanceA, coinsB: new BN(0)})
                    .send(channelInitState.balanceA.add(toNano('0.05'))); // +0.05 TON to network fees
            }

            if (data.balanceB == 0) {
                await fromWalletB
                    .topUp({coinsA: new BN(0), coinsB: channelInitState.balanceB})
                    .send(channelInitState.balanceB.add(toNano('0.05'))); // +0.05 TON to network fees
            }

            let status = 0;
            
            // while (status == 0) {
                status = await channelA.getChannelState()
                console.log('Initializing channel... Status: ', status)
                await fromWalletA.init(channelInitState).send(toNano('0.05'));
            // } 


            console.log(await channelA.getChannelState());


            const channelState1 = {
                balanceA: toNano('9'),
                balanceB: toNano('5'),
                seqnoA: new BN(1),
                seqnoB: new BN(0)
            };

            const signatureA1 = await channelA.signState(channelState1);

            if (!(await channelB.verifyState(channelState1, signatureA1))) {
                reject('Invalid A signature');
            }
            const signatureB1 = await channelB.signState(channelState1);  


            console.log(await channelA.getChannelState());
            const data2 = await channelA.getData();
            // console.log(data2)
            console.log('balanceA = ', data2.balanceA.toString())
            console.log('balanceB = ', data2.balanceB.toString())

            
            const signatureCloseA = await channelA.signClose(channelState1);

            if (!(await channelB.verifyClose(channelState1, signatureCloseA))) {
                reject('Invalid A signature');
            }

            await fromWalletB.close({
                ...channelState1,
                hisSignature: signatureCloseA
            }).send(toNano('0.05'));

            resolve()

        })
    }

    pay(amount) {
        return new Promise((resolve, reject) => {
            if (!this.channelActive) reject('No active channel!')

        })
    }

    finishChannel() {
        return new Promise((resolve, reject) => {
            if (!this.channelActive) reject('No active channel!')



            this.channelActive = false
            resolve()
        })
    }

    getBalance() {
        return new Promise(async (resolve, reject) => {       
            if (!this.walletAddressA) reject('No user wallet!');

            this.tonweb.getBalance(this.walletAddressA).then(balanceA => {
                resolve(balanceA / 1000000000);
            });
        
        })
    }
}

const t = new TonService();
t.initWallets().then(() => {
    t.startChannel()
        .then(() => {
            console.log('Done')
        })
        .catch(err => {
            console.log('error...\n\n', err)
        })
    // t.getBalance().then(balance => console.log(balance))
})

module.exports = TonService;