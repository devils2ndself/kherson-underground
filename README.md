# RenTON  

## Kherson Underground team's submission for Telegram Hack-a-TON #1

Bicycle/e-scooter rental prototype that processes transactions in TON TestNet blockchain.

The working prototype can be found [here](https://web-renton.herokuapp.com/) (https://web-renton.herokuapp.com/).

### Functional [Payment Channel service](https://github.com/devils2ndself/kherson-underground/blob/main/chariton-api/services/tonService.js)
  - Workflow:
    - Define a Service class instance.
    - Call `initWallets()` to initialize the user and the system wallets for payment channels and remember them - _only done once per runtime_.
    
    - Now we can work with payment channels and off-chain transactions as many time as we want - _however, only 1 contract at a given moment per service instance_.  
    - Call `startChannel()` method to deploy the channel, top up channel wallet balances (deposits), and initialize the channel.  
      This can be done as many times as we want in runtime; however it will not start a new channel if an active channel already exists.
    - `pay(amount)` will perform an off-chain transfer from the User's wallet balance to the System's balance inside the payment channel.  
      Can be called as many times as possible until the channel is closed.
    - Calling `closeChannel()` will close the payment channel and push it to the blockchain, distributing the funds between the two wallets.  
      Will reject if there is no active payment channel in service instance.  

  - The two TestNet wallets' addresses that we were using are `EQDGi47qkbNPyUCctuhzkbNfVfTCvWf-2CvNUbEpfB6ru9Up` (user) and `EQAKU7BeY8nGhFvYWjbVuFUEXAGweQEroUzENxSQjyBtVEgH` (system).
 
  - The active payment channel will have a new id and address each time one is started. 

### A couple of other notes:
  - Putting payment channels to hosting had it's own challenges of maximum transactions limits, so we made a decision of not uploading it to the production, but it works great in local environment.
  
  - ChariTON was our previous idea and we couldn't rename the main folders at that stage.
