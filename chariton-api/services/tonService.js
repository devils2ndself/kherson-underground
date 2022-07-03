const TonWeb = require('tonweb');
require('dotenv').config();

const BN = TonWeb.utils.BN;

const toNano = TonWeb.utils.toNano;

class TonService {

    constructor() {    

        this.channelActive = false;
        this.channelLoading = false;
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

            if (this.channelActive || this.channelLoading) reject('Channel already active!')

            this.channelLoading = true

            const balanceA = await this.tonweb.getBalance(this.walletAddressA);
            console.log('balanceA = ', (new BN(balanceA).toNumber()))
            
            const balanceB = await this.tonweb.getBalance(this.walletAddressB);
            console.log('balanceB = ', (new BN(balanceB).toNumber()))
            
            const channelInitState = {
                balanceA: toNano('1'),
                balanceB: toNano('0.5'), 
                seqnoA: new BN(0),
                seqnoB: new BN(0)
            };

            this.lastState = channelInitState;

            console.log('Init A: ', channelInitState.balanceA.toNumber(), '; Init B: ', channelInitState.balanceB.toNumber())

            const channelConfig = {
                channelId: new BN(Math.floor(Math.random() * 1000) + 10), //32 has my money - balA = 10, balB = 4, seqnoa = 1 or 2 (check) | 
                addressA: this.walletAddressA,
                addressB: this.walletAddressB, 
                initBalanceA: channelInitState.balanceA,
                initBalanceB: channelInitState.balanceB
            }

            this.channelA = this.tonweb.payments.createChannel({
                ...channelConfig,
                isA: true,
                myKeyPair: this.keyPairA,
                hisPublicKey: this.keyPairB.publicKey,
            });
            const channelAddress = await this.channelA.getAddress();
            console.log('channelAddress=', channelAddress.toString(true, true, true));

            this.channelB = this.tonweb.payments.createChannel({
                ...channelConfig,
                isA: false,
                myKeyPair: this.keyPairB,
                hisPublicKey: this.keyPairA.publicKey,
            });

            if ((await this.channelB.getAddress()).toString() !== channelAddress.toString()) {
                reject('Channels address not same');
            }


            this.fromWalletA = this.channelA.fromWallet({
                wallet: this.walletA,
                secretKey: this.keyPairA.secretKey
            });

            this.fromWalletB = this.channelB.fromWallet({
                wallet: this.walletB,
                secretKey: this.keyPairB.secretKey
            });


            this.fromWalletA.deploy().send(toNano('0.05')).then(() => {

                console.log('Deploying channel...')

                const checkDeploy = () => {
                    return new Promise((resolve) => {
                        this.channelA.getChannelState().then((status) => {
                            console.log('Deployed!');
                            resolve(true);
                        }).catch(err => { 
                            // console.log('Not deployed'); 
                            resolve(false) 
                        })
                    })
                }

                const loopCheckDeploy = () => {
                    checkDeploy().then(deployed => {
                        if (deployed) {

                            this.channelA.getChannelState().then(async status => {

                                console.log('Current Channel State: ', status);
                                const data = await this.channelA.getData();
                                // console.log(data)
                                console.log('balanceA = ', data.balanceA.toString())
                                console.log('balanceB = ', data.balanceB.toString())
                
                                let toTopA = channelInitState.balanceA.toNumber() - data.balanceA.toNumber();
                                let toTopB = channelInitState.balanceB.toNumber() - data.balanceB.toNumber();

                                console.log('Top Up A with: ', toTopA);
                                console.log('Top Up B with: ', toTopB);


                                this.fromWalletA
                                    .topUp({coinsA: new BN(toTopA.toString()), coinsB: new BN(0)})
                                    .send(channelInitState.balanceA.add(toNano('0.05')))
                                    
            
                                this.fromWalletB
                                    .topUp({coinsA: new BN(0), coinsB: new BN(toTopB.toString())})
                                    .send(channelInitState.balanceB.add(toNano('0.05')))

                                const checkTopUp = () => {
                                    return new Promise((resolve) => {
                                        this.channelA.getData().then((data) => {
                                            if (
                                                channelInitState.balanceA.toNumber() == data.balanceA.toNumber() &&
                                                channelInitState.balanceB.toNumber() == data.balanceB.toNumber()
                                            ) {
                                                console.log('Topped up!');
                                                resolve(true);
                                            } else {
                                                resolve(false);
                                            }
                                        })
                                    })
                                }

                                const loopcheckTopUp = () => {
                                    checkTopUp().then(topped => {
                                        if (topped) {

                                            this.channelA.getData().then(data => {
                                                console.log('balanceA = ', data.balanceA.toString())
                                                console.log('balanceB = ', data.balanceB.toString())
                                            });

                                            this.fromWalletA.init(channelInitState).send(toNano('0.05'))
                                                .then(() => {

                                                    console.log('Initializing...')
                                                    
                                                    const checkInit = () => {
                                                        return new Promise((resolve) => {
                                                            this.channelA.getChannelState().then(status => {
                                                                if (status != 0) {
                                                                    console.log('Initialized! Status: ', status);
                                                                    resolve(true);
                                                                } else {
                                                                    resolve(false);
                                                                }
                                                            })
                                                        })
                                                    }

                                                    const loopCheckInit = () => {
                                                        checkInit().then(initialized => {
                                                            if (initialized) {
                                                                this.channelLoading = false
                                                                this.channelActive = true
                                                                resolve()
                                                            } else {
                                                                return loopCheckInit()
                                                            }
                                                        })
                                                    }

                                                    loopCheckInit();
                    
                                            })
                                            .catch(err => reject(err))

                                        } else {
                                            return loopcheckTopUp()
                                        }
                                    })
                                }
                                
                                loopcheckTopUp();
        
                            })
                            

                        } else {
                            return loopCheckDeploy()
                        }
                    })
                }

                loopCheckDeploy()

            }).catch(err => reject(err))

        })
    }

    pay(amount) {
        return new Promise(async (resolve, reject) => {
            if (!this.channelActive) reject('No active channel!')

            amount = amount.toString();
        
            console.log('Starting payment with amount of: ', amount);

            const channelState = {
                balanceA: new BN(this.lastState.balanceA.toNumber() - toNano(amount).toNumber()),
                balanceB: new BN(this.lastState.balanceB.toNumber() + toNano(amount).toNumber()),
                seqnoA: new BN(this.lastState.seqnoB.toNumber() + 1),
                seqnoB: new BN(0)
            };

            console.log(channelState.balanceA.toNumber(), channelState.balanceB.toNumber(), channelState.seqnoA.toNumber(), channelState.seqnoB.toNumber())

            this.channelA.signState(channelState).then(signatureA1 => setTimeout(async () => {
                if (!(await this.channelB.verifyState(channelState, signatureA1))) {
                    reject('Invalid A signature');
                } 
    
                const signatureB1 = await this.channelB.signState(channelState).then();
    
                this.lastState = channelState
    
                const data2 = await this.channelA.getData();
                // console.log(data2)
                console.log('balanceA = ', data2.balanceA.toString())
                console.log('balanceB = ', data2.balanceB.toString())
    
                resolve(true)
            }, 500))
            .catch(err => reject(err))
            

        })
    }

    closeChannel() {
        return new Promise(async (resolve, reject) => {
            if (!this.channelActive) reject('No active channel!')

            console.log('Closing the channel...')
        
            const signatureCloseA = await this.channelA.signClose(this.lastState);

            if (!(await this.channelB.verifyClose(this.lastState, signatureCloseA))) {
                reject('Invalid A signature');
            } else {
                this.fromWalletB.close({
                    ...this.lastState,
                    hisSignature: signatureCloseA
                }).send(toNano('0.05'))
                    .then(() => {
                        this.channelActive = false
                        resolve(true)
                    })
                    .catch(err => {
                        reject(err)
                    })
            }

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
    t.startChannel().then(() => {
        console.log('Channel started.')
        // t.pay(0.25).then(() => {
        //     console.log('Paid 0.25 once')
        //     t.pay(0.25).then(() => {
        //         console.log('Paid 0.25 twice')
        //         t.closeChannel().then(() => {
        //             console.log('Channel closed.')
        //         })
        //     })
        // }).catch(err => {
        //     console.log('error...\n\n', err)
        // })
        
    }).catch(err => {
        console.log('error...\n\n', err)
    })
    // t.getBalance().then(balance => console.log(balance))
})

module.exports = TonService;