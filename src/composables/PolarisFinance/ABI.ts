export const airdropABI = JSON.parse(
  '[{"inputs": [{"internalType": "address", "name": "_xpolar", "type": "address"}, {"internalType": "uint256", "name": "_poolStartTime", "type": "uint256"}], "stateMutability": "nonpayable", "type": "constructor", "name": "constructor"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {"indexed": true, "internalType": "uint256", "name": "pid", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "Deposit", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {"indexed": true, "internalType": "uint256", "name": "pid", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "EmergencyWithdraw", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "RewardPaid", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}, {"indexed": true, "internalType": "uint256", "name": "pid", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}], "name": "Withdraw", "type": "event"}, {"inputs": [], "name": "TOTAL_REWARDS", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "_user", "type": "address"}, {"internalType": "uint256", "name": "_allocPoint", "type": "uint256"}, {"internalType": "uint256", "name": "_lastRewardTime", "type": "uint256"}, {"internalType": "bool", "name": "_withUpdate", "type": "bool"}], "name": "add", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "address[]", "name": "_users", "type": "address[]"}, {"internalType": "uint256[]", "name": "_allocPoints", "type": "uint256[]"}, {"internalType": "bool", "name": "_withUpdate", "type": "bool"}, {"internalType": "uint256", "name": "_lastRewardTime", "type": "uint256"}], "name": "addAddresses", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "address", "name": "_user", "type": "address"}], "name": "addressToPid", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "_fromTime", "type": "uint256"}, {"internalType": "uint256", "name": "_toTime", "type": "uint256"}], "name": "getGeneratedReward", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "contract IERC20", "name": "_token", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}, {"internalType": "address", "name": "to", "type": "address"}], "name": "governanceRecoverUnsupported", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "governanceRetire", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "massUpdatePools", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "operator", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "_user", "type": "address"}], "name": "pendingShare", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "poolEndTime", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "name": "poolInfo", "outputs": [{"internalType": "uint256", "name": "allocPoint", "type": "uint256"}, {"internalType": "uint256", "name": "lastRewardTime", "type": "uint256"}, {"internalType": "uint256", "name": "accXpolarPerShare", "type": "uint256"}, {"internalType": "bool", "name": "isStarted", "type": "bool"}, {"internalType": "address", "name": "user", "type": "address"}, {"internalType": "uint256", "name": "vested", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "poolStartTime", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "runningTime", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}, {"internalType": "uint256", "name": "_allocPoint", "type": "uint256"}], "name": "set", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "address[]", "name": "_users", "type": "address[]"}, {"internalType": "uint256[]", "name": "_allocPoints", "type": "uint256[]"}], "name": "setAddresses", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "address", "name": "_operator", "type": "address"}], "name": "setOperator", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "totalAllocPoint", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "_pid", "type": "uint256"}], "name": "updatePool", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {"internalType": "address", "name": "", "type": "address"}], "name": "userInfo", "outputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}, {"internalType": "uint256", "name": "rewardDebt", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [{"internalType": "address", "name": "_user", "type": "address"}], "name": "vested", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {"inputs": [], "name": "xpolar", "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"}, {"inputs": [], "name": "xpolarPerSecond", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}]'
);

export const ERC20ABI = JSON.parse(`[
   {
       "constant": true,
       "inputs": [],
       "name": "name",
       "outputs": [
           {
               "name": "",
               "type": "string"
           }
       ],
       "payable": false,
       "stateMutability": "view",
       "type": "function"
   },
   {
       "constant": false,
       "inputs": [
           {
               "name": "_spender",
               "type": "address"
           },
           {
               "name": "_value",
               "type": "uint256"
           }
       ],
       "name": "approve",
       "outputs": [
           {
               "name": "",
               "type": "bool"
           }
       ],
       "payable": false,
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "constant": true,
       "inputs": [],
       "name": "totalSupply",
       "outputs": [
           {
               "name": "",
               "type": "uint256"
           }
       ],
       "payable": false,
       "stateMutability": "view",
       "type": "function"
   },
   {
       "constant": false,
       "inputs": [
           {
               "name": "_from",
               "type": "address"
           },
           {
               "name": "_to",
               "type": "address"
           },
           {
               "name": "_value",
               "type": "uint256"
           }
       ],
       "name": "transferFrom",
       "outputs": [
           {
               "name": "",
               "type": "bool"
           }
       ],
       "payable": false,
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "constant": true,
       "inputs": [],
       "name": "decimals",
       "outputs": [
           {
               "name": "",
               "type": "uint8"
           }
       ],
       "payable": false,
       "stateMutability": "view",
       "type": "function"
   },
   {
       "constant": true,
       "inputs": [
           {
               "name": "_owner",
               "type": "address"
           }
       ],
       "name": "balanceOf",
       "outputs": [
           {
               "name": "balance",
               "type": "uint256"
           }
       ],
       "payable": false,
       "stateMutability": "view",
       "type": "function"
   },
   {
       "constant": true,
       "inputs": [],
       "name": "symbol",
       "outputs": [
           {
               "name": "",
               "type": "string"
           }
       ],
       "payable": false,
       "stateMutability": "view",
       "type": "function"
   },
   {
       "constant": false,
       "inputs": [
           {
               "name": "_to",
               "type": "address"
           },
           {
               "name": "_value",
               "type": "uint256"
           }
       ],
       "name": "transfer",
       "outputs": [
           {
               "name": "",
               "type": "bool"
           }
       ],
       "payable": false,
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "constant": true,
       "inputs": [
           {
               "name": "_owner",
               "type": "address"
           },
           {
               "name": "_spender",
               "type": "address"
           }
       ],
       "name": "allowance",
       "outputs": [
           {
               "name": "",
               "type": "uint256"
           }
       ],
       "payable": false,
       "stateMutability": "view",
       "type": "function"
   },
   {
       "payable": true,
       "stateMutability": "payable",
       "type": "fallback"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": true,
               "name": "owner",
               "type": "address"
           },
           {
               "indexed": true,
               "name": "spender",
               "type": "address"
           },
           {
               "indexed": false,
               "name": "value",
               "type": "uint256"
           }
       ],
       "name": "Approval",
       "type": "event"
   },
   {
       "anonymous": false,
       "inputs": [
           {
               "indexed": true,
               "name": "from",
               "type": "address"
           },
           {
               "indexed": true,
               "name": "to",
               "type": "address"
           },
           {
               "indexed": false,
               "name": "value",
               "type": "uint256"
           }
       ],
       "name": "Transfer",
       "type": "event"
   }
]`);

export const xpolarRewardPoolABI = JSON.parse(
  `[
    {
       "inputs":[
          {
             "internalType":"address",
             "name":"_xpolar",
             "type":"address"
          },
          {
             "internalType":"uint256",
             "name":"_poolStartTime",
             "type":"uint256"
          }
       ],
       "stateMutability":"nonpayable",
       "type":"constructor",
       "name":"constructor"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "internalType":"address",
             "name":"user",
             "type":"address"
          },
          {
             "indexed":true,
             "internalType":"uint256",
             "name":"pid",
             "type":"uint256"
          },
          {
             "indexed":false,
             "internalType":"uint256",
             "name":"amount",
             "type":"uint256"
          }
       ],
       "name":"Deposit",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "internalType":"address",
             "name":"user",
             "type":"address"
          },
          {
             "indexed":true,
             "internalType":"uint256",
             "name":"pid",
             "type":"uint256"
          },
          {
             "indexed":false,
             "internalType":"uint256",
             "name":"amount",
             "type":"uint256"
          }
       ],
       "name":"EmergencyWithdraw",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "internalType":"address",
             "name":"user",
             "type":"address"
          },
          {
             "indexed":false,
             "internalType":"uint256",
             "name":"amount",
             "type":"uint256"
          }
       ],
       "name":"RewardPaid",
       "type":"event"
    },
    {
       "anonymous":false,
       "inputs":[
          {
             "indexed":true,
             "internalType":"address",
             "name":"user",
             "type":"address"
          },
          {
             "indexed":true,
             "internalType":"uint256",
             "name":"pid",
             "type":"uint256"
          },
          {
             "indexed":false,
             "internalType":"uint256",
             "name":"amount",
             "type":"uint256"
          }
       ],
       "name":"Withdraw",
       "type":"event"
    },
    {
       "inputs":[
          
       ],
       "name":"TOTAL_REWARDS",
       "outputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"_allocPoint",
             "type":"uint256"
          },
          {
             "internalType":"contract IERC20",
             "name":"_token",
             "type":"address"
          },
          {
             "internalType":"bool",
             "name":"_withUpdate",
             "type":"bool"
          },
          {
             "internalType":"uint256",
             "name":"_lastRewardTime",
             "type":"uint256"
          }
       ],
       "name":"add",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"_pid",
             "type":"uint256"
          },
          {
             "internalType":"uint256",
             "name":"_amount",
             "type":"uint256"
          }
       ],
       "name":"deposit",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"_pid",
             "type":"uint256"
          }
       ],
       "name":"emergencyWithdraw",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"_fromTime",
             "type":"uint256"
          },
          {
             "internalType":"uint256",
             "name":"_toTime",
             "type":"uint256"
          }
       ],
       "name":"getGeneratedReward",
       "outputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"contract IERC20",
             "name":"_token",
             "type":"address"
          },
          {
             "internalType":"uint256",
             "name":"amount",
             "type":"uint256"
          },
          {
             "internalType":"address",
             "name":"to",
             "type":"address"
          }
       ],
       "name":"governanceRecoverUnsupported",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "name":"governanceRetire",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "name":"harvestAllRewards",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "name":"massUpdatePools",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "name":"operator",
       "outputs":[
          {
             "internalType":"address",
             "name":"",
             "type":"address"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"_pid",
             "type":"uint256"
          },
          {
             "internalType":"address",
             "name":"_user",
             "type":"address"
          }
       ],
       "name":"pendingShare",
       "outputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "name":"poolEndTime",
       "outputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          }
       ],
       "name":"poolInfo",
       "outputs":[
          {
             "internalType":"contract IERC20",
             "name":"token",
             "type":"address"
          },
          {
             "internalType":"uint256",
             "name":"allocPoint",
             "type":"uint256"
          },
          {
             "internalType":"uint256",
             "name":"lastRewardTime",
             "type":"uint256"
          },
          {
             "internalType":"uint256",
             "name":"accXpolarPerShare",
             "type":"uint256"
          },
          {
             "internalType":"bool",
             "name":"isStarted",
             "type":"bool"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "name":"poolStartTime",
       "outputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "name":"runningTime",
       "outputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"_pid",
             "type":"uint256"
          },
          {
             "internalType":"uint256",
             "name":"_allocPoint",
             "type":"uint256"
          }
       ],
       "name":"set",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"address",
             "name":"_operator",
             "type":"address"
          }
       ],
       "name":"setOperator",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "name":"totalAllocPoint",
       "outputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"_pid",
             "type":"uint256"
          }
       ],
       "name":"updatePool",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          },
          {
             "internalType":"address",
             "name":"",
             "type":"address"
          }
       ],
       "name":"userInfo",
       "outputs":[
          {
             "internalType":"uint256",
             "name":"amount",
             "type":"uint256"
          },
          {
             "internalType":"uint256",
             "name":"rewardDebt",
             "type":"uint256"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"_pid",
             "type":"uint256"
          },
          {
             "internalType":"uint256",
             "name":"_amount",
             "type":"uint256"
          }
       ],
       "name":"withdraw",
       "outputs":[
          
       ],
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "name":"xpolar",
       "outputs":[
          {
             "internalType":"contract IERC20",
             "name":"",
             "type":"address"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "name":"xpolarPerSecond",
       "outputs":[
          {
             "internalType":"uint256",
             "name":"",
             "type":"uint256"
          }
       ],
       "stateMutability":"view",
       "type":"function"
    }
 ]`
);

export const spolarABI = JSON.parse(
  `[{
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },{
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },{
        "inputs": [
          { "internalType": "address", "name": "spender", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`
);

export const sunriseABI = JSON.parse(`[{
  "inputs": [],
  "name": "epoch",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
  "name": "balanceOf",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [{ "internalType": "address", "name": "mason", "type": "address" }],
  "name": "earned",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [{ "internalType": "address", "name": "mason", "type": "address" }],
  "name": "canWithdraw",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [{ "internalType": "address", "name": "mason", "type": "address" }],
  "name": "canClaimReward",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
  "name": "stake",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},{
  "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
  "name": "withdraw",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},{
  "inputs": [],
  "name": "claimReward",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},{
  "inputs": [],
  "name": "latestSnapshotIndex",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "name": "masonryHistory",
  "outputs": [
    { "internalType": "uint256", "name": "time", "type": "uint256" },
    { "internalType": "uint256", "name": "rewardReceived", "type": "uint256" },
    { "internalType": "uint256", "name": "rewardPerShare", "type": "uint256" }
  ],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "name": "masons",
  "outputs": [
    { "internalType": "uint256", "name": "lastSnapshotIndex", "type": "uint256" },
    { "internalType": "uint256", "name": "rewardEarned", "type": "uint256" },
    { "internalType": "uint256", "name": "epochTimerStart", "type": "uint256" }
  ],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [],
  "name": "withdrawLockupEpochs",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [],
  "name": "rewardLockupEpochs",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}]`);

export const treasuryABI = name => {
  return JSON.parse(
    `[{
  "inputs": [],
  "name": "previousEpoch` +
      `${name.charAt(0).toUpperCase()}` +
      `${name.slice(1)}` +
      `Price",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "` +
      name +
      `PriceCeiling",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [],
  "name": "get` +
      `${name.charAt(0).toUpperCase()}` +
      `${name.slice(1)}` +
      `UpdatedPrice",
  "outputs": [{ "internalType": "uint256", "name": "_ethernalPrice", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [],
  "name": "get` +
      `${name.charAt(0).toUpperCase()}` +
      `${name.slice(1)}` +
      `Price",
  "outputs": [{ "internalType": "uint256", "name": "_ethernalPrice", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [],
  "name": "nextEpochPoint",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [],
  "name": "PERIOD",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [
    { "internalType": "uint256", "name": "_polarAmount", "type": "uint256" },
    { "internalType": "uint256", "name": "targetPrice", "type": "uint256" }
  ],
  "name": "buyBonds",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}]`
  );
};

export const polarTreasuryABI = JSON.parse(`[{
  "inputs": [],
  "name": "previousEpochpolarPrice",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
"inputs": [],
"name": "polarPriceCeiling",
"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
"stateMutability": "view",
"type": "function"
},{
"inputs": [],
"name": "getpolarUpdatedPrice",
"outputs": [{ "internalType": "uint256", "name": "_polarPrice", "type": "uint256" }],
"stateMutability": "view",
"type": "function"
},{
  "inputs": [],
  "name": "getpolarPrice",
  "outputs": [{ "internalType": "uint256", "name": "_polarPrice", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
  },{
  "inputs": [],
  "name": "nextEpochPoint",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [],
  "name": "PERIOD",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [
    { "internalType": "uint256", "name": "_polarAmount", "type": "uint256" },
    { "internalType": "uint256", "name": "targetPrice", "type": "uint256" }
  ],
  "name": "buyBonds",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}]`);

export const uniswapABI = JSON.parse(
  `[{"inputs":[],"payable":"false","stateMutability":"nonpayable","type":"constructor"},{"anonymous":"false","inputs":[{"indexed":"true","internalType":"address","name":"owner","type":"address"},{"indexed":"true","internalType":"address","name":"spender","type":"address"},{"indexed":"false","internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":"false","inputs":[{"indexed":"true","internalType":"address","name":"sender","type":"address"},{"indexed":"false","internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":"false","internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":"true","internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":"false","inputs":[{"indexed":"true","internalType":"address","name":"sender","type":"address"},{"indexed":"false","internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":"false","internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":"false","inputs":[{"indexed":"true","internalType":"address","name":"sender","type":"address"},{"indexed":"false","internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":"false","internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":"false","internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":"false","internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":"true","internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":"false","inputs":[{"indexed":"false","internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":"false","internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":"false","inputs":[{"indexed":"true","internalType":"address","name":"from","type":"address"},{"indexed":"true","internalType":"address","name":"to","type":"address"},{"indexed":"false","internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":"true","inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"false","inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[],"name":"sync","outputs":[],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":"false","stateMutability":"nonpayable","type":"function"}]`
);

export const tokenABI = JSON.parse(`[{
  "inputs": [
    { "internalType": "address", "name": "owner", "type": "address" },
    { "internalType": "address", "name": "spender", "type": "address" }
  ],
  "name": "allowance",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [
    { "internalType": "address", "name": "spender", "type": "address" },
    { "internalType": "uint256", "name": "amount", "type": "uint256" }
  ],
  "name": "approve",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "nonpayable",
  "type": "function"
},{
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
  "name": "balanceOf",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}]`);

export const bondABI = JSON.parse(`[{
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
  "name": "balanceOf",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},{
  "inputs": [
    { "internalType": "uint256", "name": "_bondAmount", "type": "uint256" },
    { "internalType": "uint256", "name": "targetPrice", "type": "uint256" }
  ],
  "name": "redeemBonds",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}]`);

export const xpolarABI =
  JSON.parse(`[{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"Snapshot","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SNAPSHOT_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"snapshotId","type":"uint256"}],"name":"balanceOfAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"snapshot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"snapshotId","type":"uint256"}],"name":"totalSupplyAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]
`);
