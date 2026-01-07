/**
 * Static Aurora pool data for direct swaps.
 * Generated from voting-gauges.json
 */

export interface AuroraPoolToken {
  address: string;
  symbol: string;
  weight: string | null;
}

export interface AuroraPool {
  id: string;
  address: string;
  poolType: string;
  symbol: string;
  tokens: AuroraPoolToken[];
}

export const AURORA_POOLS: AuroraPool[] = [
  {
    "id": "0x5f5f57abf920a88e77513a28d41df39a0e0b4b6a000200000000000000000035",
    "address": "0x5F5F57Abf920a88e77513a28D41df39a0e0B4b6a",
    "poolType": "Weighted",
    "symbol": "50ETHERNAL-50BINARIS",
    "tokens": [
      {
        "address": "0x17cbd9C274e90C537790C51b4015a65cD015497e",
        "symbol": "ETHERNAL",
        "weight": "0.5"
      },
      {
        "address": "0xafE0d6ca6AAbB43CDA024895D203120831Ba0370",
        "symbol": "BINARIS",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x293bbbef6087f681a8110f08bbdedadd13599fc3000200000000000000000007",
    "address": "0x293bBBef6087F681a8110F08BbDEdaDd13599Fc3",
    "poolType": "Weighted",
    "symbol": "pDEX-Ethernal-wETH",
    "tokens": [
      {
        "address": "0x17cbd9C274e90C537790C51b4015a65cD015497e",
        "symbol": "ETHERNAL",
        "weight": "0.5"
      },
      {
        "address": "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "symbol": "WETH",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x2ec560ba933e8994482af76d63378bdc5354402100020000000000000000002a",
    "address": "0x2Ec560ba933E8994482aF76D63378bDC53544021",
    "poolType": "Weighted",
    "symbol": "50PBOND-50POLAR",
    "tokens": [
      {
        "address": "0x3a4773e600086A753862621A26a2E3274610da43",
        "symbol": "PBOND",
        "weight": "0.5"
      },
      {
        "address": "0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86",
        "symbol": "POLAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xe370d4d0727d4e9b70db1a2f7d2efd1010ff1d6d000200000000000000000021",
    "address": "0xE370d4d0727d4E9b70DB1a2f7d2eFd1010FF1d6D",
    "poolType": "Weighted",
    "symbol": "SOL-USDC",
    "tokens": [
      {
        "address": "0x0f00576d07B594Bdc1caf44b6014A6A02E5AFd48",
        "symbol": "SOL",
        "weight": "0.5"
      },
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC.e",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xa83f9fa9b51fc26e9925a07bc3375617b473e051000200000000000000000005",
    "address": "0xA83f9Fa9B51fc26e9925A07BC3375617B473e051",
    "poolType": "Weighted",
    "symbol": "pDEX-Polar-pStnear",
    "tokens": [
      {
        "address": "0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86",
        "symbol": "POLAR",
        "weight": "0.5"
      },
      {
        "address": "0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465",
        "symbol": "pSTNEAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xec0fac82d2aac483871874407d25614cf6dd9ce5000200000000000000000030",
    "address": "0xEC0FaC82D2aac483871874407D25614Cf6dd9Ce5",
    "poolType": "Weighted",
    "symbol": "50ORBITAL-50USP",
    "tokens": [
      {
        "address": "0x3AC55eA8D2082fAbda674270cD2367dA96092889",
        "symbol": "ORBITAL",
        "weight": "0.5"
      },
      {
        "address": "0xa69d9Ba086D41425f35988613c156Db9a88a1A96",
        "symbol": "USP",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x6e7c170f95aba8ffbccaf5155706be0682cc5bd900020000000000000000002b",
    "address": "0x6E7C170f95Aba8FfBcCaF5155706Be0682Cc5bD9",
    "poolType": "Weighted",
    "symbol": "50BINARIS-50BBOND",
    "tokens": [
      {
        "address": "0xafE0d6ca6AAbB43CDA024895D203120831Ba0370",
        "symbol": "BINARIS",
        "weight": "0.5"
      },
      {
        "address": "0xfa32616447C51F056Db97BC1d0E2D4C0c4D059C9",
        "symbol": "BBOND",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xae4d320cc49f57a2bf6f628a749f5aba19d2c7ea000200000000000000000031",
    "address": "0xAe4D320cC49F57A2BF6F628a749f5aBa19d2C7eA",
    "poolType": "Weighted",
    "symbol": "50ETHERNAL-50USP",
    "tokens": [
      {
        "address": "0x17cbd9C274e90C537790C51b4015a65cD015497e",
        "symbol": "ETHERNAL",
        "weight": "0.5"
      },
      {
        "address": "0xa69d9Ba086D41425f35988613c156Db9a88a1A96",
        "symbol": "USP",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xf53a4381f3a4f08726970bc6bb23c4ee3ef101ed000200000000000000000033",
    "address": "0xf53a4381F3a4F08726970BC6bb23c4ee3Ef101eD",
    "poolType": "Weighted",
    "symbol": "50ETHERNAL-50ORBITAL",
    "tokens": [
      {
        "address": "0x17cbd9C274e90C537790C51b4015a65cD015497e",
        "symbol": "ETHERNAL",
        "weight": "0.5"
      },
      {
        "address": "0x3AC55eA8D2082fAbda674270cD2367dA96092889",
        "symbol": "ORBITAL",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xa6ac7ce1d7aefd7abd06d93e6b89489aedf03d14000200000000000000000029",
    "address": "0xa6Ac7cE1d7AeFd7aBD06d93E6B89489aeDF03D14",
    "poolType": "Weighted",
    "symbol": "50USP-50USPBOND",
    "tokens": [
      {
        "address": "0xa69d9Ba086D41425f35988613c156Db9a88a1A96",
        "symbol": "USP",
        "weight": "0.5"
      },
      {
        "address": "0xcE32b28c19C61B19823395730A0c7d91C671E54b",
        "symbol": "USPBOND",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xd8e9e1916a4d98fb0dc6db725a8c8c2af08a329b00020000000000000000000f",
    "address": "0xD8E9e1916a4D98Fb0dc6Db725a8C8c2AF08a329b",
    "poolType": "Weighted",
    "symbol": "pDEX-abBNB-USDC",
    "tokens": [
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC",
        "weight": "0.5"
      },
      {
        "address": "0xb14674C7264eC7d948B904Aab2c0E0F906F6e762",
        "symbol": "abBNB",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x4652df40de98c20e73d88983a8b74e4aa014bdf3000200000000000000000032",
    "address": "0x4652Df40de98c20E73d88983A8b74E4AA014bDf3",
    "poolType": "Weighted",
    "symbol": "50USP-50BINARIS",
    "tokens": [
      {
        "address": "0xa69d9Ba086D41425f35988613c156Db9a88a1A96",
        "symbol": "USP",
        "weight": "0.5"
      },
      {
        "address": "0xafE0d6ca6AAbB43CDA024895D203120831Ba0370",
        "symbol": "BINARIS",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x3c5b26cde094fe7e5c75651a7ab5e9520ec06e5700020000000000000000002e",
    "address": "0x3c5b26cdE094Fe7E5C75651a7ab5e9520ec06E57",
    "poolType": "Weighted",
    "symbol": "50BINARIS-50POLAR",
    "tokens": [
      {
        "address": "0xafE0d6ca6AAbB43CDA024895D203120831Ba0370",
        "symbol": "BINARIS",
        "weight": "0.5"
      },
      {
        "address": "0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86",
        "symbol": "POLAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x9cd44e44e8a61bc7dc34b04c762a3c0137a3707c000200000000000000000002",
    "address": "0x9CD44E44E8a61Bc7DC34B04C762a3C0137a3707C",
    "poolType": "Weighted",
    "symbol": "50USDC-50WETH",
    "tokens": [
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC",
        "weight": "0.5"
      },
      {
        "address": "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "symbol": "WETH",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x0fb037f35f5a00f66e3fc9a29f2dca59c12bfc5f000200000000000000000027",
    "address": "0x0FB037f35F5a00f66E3fC9A29f2dca59c12BfC5f",
    "poolType": "Weighted",
    "symbol": "50OBOND-50ORBITAL",
    "tokens": [
      {
        "address": "0x192bdcdd7b95A97eC66dE5630a85967F6B79e695",
        "symbol": "OBOND",
        "weight": "0.5"
      },
      {
        "address": "0x3AC55eA8D2082fAbda674270cD2367dA96092889",
        "symbol": "ORBITAL",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x89cc63050ade84bffafd7ec84d24fc0feb5f96c9000200000000000000000020",
    "address": "0x89cC63050Ade84BfFafd7ec84d24fc0FEb5f96c9",
    "poolType": "Weighted",
    "symbol": "AVAX-USDC",
    "tokens": [
      {
        "address": "0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844",
        "symbol": "AVAX",
        "weight": "0.5"
      },
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC.e",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x454adaa07eec2c432c0df4379a709b1fa4c800ed000200000000000000000016",
    "address": "0x454Adaa07EEC2C432C0df4379A709B1fA4C800eD",
    "poolType": "Weighted",
    "symbol": "pDEX-pNEAR-pSTNEAR",
    "tokens": [
      {
        "address": "0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6",
        "symbol": "pNEAR",
        "weight": "0.5"
      },
      {
        "address": "0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465",
        "symbol": "pSTNEAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xa215a58225b344cbb62fcf762e8e884dbedfbe58000200000000000000000006",
    "address": "0xa215a58225b344cbb62FCf762E8e884Dbedfbe58",
    "poolType": "Weighted",
    "symbol": "pDEX-Orbital-wBTC",
    "tokens": [
      {
        "address": "0x3AC55eA8D2082fAbda674270cD2367dA96092889",
        "symbol": "ORBITAL",
        "weight": "0.5"
      },
      {
        "address": "0xF4eB217Ba2454613b15dBdea6e5f22276410e89e",
        "symbol": "WBTC",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x0993fa12d3256e85da64866354ec3532f187e178000200000000000000000008",
    "address": "0x0993fA12d3256E85da64866354eC3532F187e178",
    "poolType": "Weighted",
    "symbol": "pDEX-USP-USDC",
    "tokens": [
      {
        "address": "0xa69d9Ba086D41425f35988613c156Db9a88a1A96",
        "symbol": "USP",
        "weight": "0.5"
      },
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x435de7d1c13cfec80997510bd38bcb45282e6a0f000200000000000000000034",
    "address": "0x435de7d1C13cfEc80997510BD38Bcb45282e6a0F",
    "poolType": "Weighted",
    "symbol": "50ORBITAL-50BINARIS",
    "tokens": [
      {
        "address": "0x3AC55eA8D2082fAbda674270cD2367dA96092889",
        "symbol": "ORBITAL",
        "weight": "0.5"
      },
      {
        "address": "0xafE0d6ca6AAbB43CDA024895D203120831Ba0370",
        "symbol": "BINARIS",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x244caf21eaa7029db9d6b42ddf2d95800a2f5eb500020000000000000000000a",
    "address": "0x244CAF21eAa7029DB9d6b42Ddf2d95800a2f5eB5",
    "poolType": "Weighted",
    "symbol": "pDEX-pNEAR-USDC",
    "tokens": [
      {
        "address": "0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6",
        "symbol": "pNEAR",
        "weight": "0.5"
      },
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x4200333dc021ea5fb1050b8e4f8f3ed7cb1d22ed00020000000000000000000c",
    "address": "0x4200333dc021eA5Fb1050b8e4F8F3Ed7cb1d22ed",
    "poolType": "Weighted",
    "symbol": "50AURORA-50USDC",
    "tokens": [
      {
        "address": "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79",
        "symbol": "AURORA",
        "weight": "0.5"
      },
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xd88a378abfe6b6e232525dfb03fbe01ecc863c10000200000000000000000004",
    "address": "0xd88a378AbFe6B6e232525DfB03FBe01ECC863c10",
    "poolType": "Weighted",
    "symbol": "pDEX-Polar-pNear",
    "tokens": [
      {
        "address": "0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6",
        "symbol": "pNEAR",
        "weight": "0.5"
      },
      {
        "address": "0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86",
        "symbol": "POLAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xf0b6cf745afe642c4565165922ad62d6a93857c100020000000000000000000e",
    "address": "0xf0b6cf745aFE642C4565165922ad62D6a93857C1",
    "poolType": "Weighted",
    "symbol": "pDEX-Binaris-abBNB",
    "tokens": [
      {
        "address": "0xafE0d6ca6AAbB43CDA024895D203120831Ba0370",
        "symbol": "BINARIS",
        "weight": "0.5"
      },
      {
        "address": "0xb14674C7264eC7d948B904Aab2c0E0F906F6e762",
        "symbol": "abBNB",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x9127442d0a170cc0efb5d164582948f21c37312e000200000000000000000028",
    "address": "0x9127442d0A170Cc0EfB5D164582948f21C37312E",
    "poolType": "Weighted",
    "symbol": "50ETHERNAL-50EBOND",
    "tokens": [
      {
        "address": "0x17cbd9C274e90C537790C51b4015a65cD015497e",
        "symbol": "ETHERNAL",
        "weight": "0.5"
      },
      {
        "address": "0x266437E6c7500A947012F19A3dE96a3881a0449E",
        "symbol": "EBOND",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xe03dc509b05e7d80ee863c0d4144ddc5a03e652300020000000000000000002d",
    "address": "0xe03dc509b05E7D80Ee863C0D4144DDC5A03E6523",
    "poolType": "Weighted",
    "symbol": "50ETHERNAL-50POLAR",
    "tokens": [
      {
        "address": "0x17cbd9C274e90C537790C51b4015a65cD015497e",
        "symbol": "ETHERNAL",
        "weight": "0.5"
      },
      {
        "address": "0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86",
        "symbol": "POLAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x20169fb10ca8635f4f5c487f7ce811aa5ae08a7300020000000000000000002f",
    "address": "0x20169fB10ca8635f4F5C487f7cE811Aa5Ae08a73",
    "poolType": "Weighted",
    "symbol": "50USP-50POLAR",
    "tokens": [
      {
        "address": "0xa69d9Ba086D41425f35988613c156Db9a88a1A96",
        "symbol": "USP",
        "weight": "0.5"
      },
      {
        "address": "0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86",
        "symbol": "POLAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xb3a04902b78fbe61185b766866193630db4db8a300020000000000000000000d",
    "address": "0xB3a04902B78FbE61185B766866193630DB4Db8A3",
    "poolType": "Weighted",
    "symbol": "50USDC-50WBTC",
    "tokens": [
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC",
        "weight": "0.5"
      },
      {
        "address": "0xF4eB217Ba2454613b15dBdea6e5f22276410e89e",
        "symbol": "WBTC",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x089352cdc9d23ab490317ad5aa838e4e0780165d00020000000000000000002c",
    "address": "0x089352Cdc9d23Ab490317ad5AA838E4e0780165d",
    "poolType": "Weighted",
    "symbol": "50ORBITAL-50POLAR",
    "tokens": [
      {
        "address": "0x3AC55eA8D2082fAbda674270cD2367dA96092889",
        "symbol": "ORBITAL",
        "weight": "0.5"
      },
      {
        "address": "0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86",
        "symbol": "POLAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xceecce984f498ee00832670e9ca6d372f6ce155a000200000000000000000014",
    "address": "0xCEeCCe984F498ee00832670e9Ca6d372F6cE155a",
    "poolType": "Stable",
    "symbol": "pDEX-USDC-USDT.e",
    "tokens": [
      {
        "address": "0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
        "symbol": "USDT.e",
        "weight": null
      },
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC.e",
        "weight": null
      }
    ]
  },
  {
    "id": "0xb615c4febfe88b2c93774bcff32b5a5be25e66ec000200000000000000000037",
    "address": "0xb615C4FEbfe88B2C93774BcFF32b5a5BE25E66EC",
    "poolType": "Weighted",
    "symbol": "50pNEAR-50SPOLAR",
    "tokens": [
      {
        "address": "0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6",
        "symbol": "pNEAR",
        "weight": "0.5"
      },
      {
        "address": "0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729",
        "symbol": "SPOLAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x8afc3d8ddbcc76de12a219f6ec7226e7a7c190fc000200000000000000000036",
    "address": "0x8aFC3D8DdBcc76de12a219f6EC7226e7A7C190FC",
    "poolType": "Weighted",
    "symbol": "50pNEAR-50XPOLAR",
    "tokens": [
      {
        "address": "0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6",
        "symbol": "pNEAR",
        "weight": "0.5"
      },
      {
        "address": "0xeAf7665969f1DaA3726CEADa7c40Ab27B3245993",
        "symbol": "XPOLAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x80cba127d820f0138d252009b7a073955a4e7d75000200000000000000000039",
    "address": "0x80cBA127D820f0138D252009b7A073955A4E7d75",
    "poolType": "Weighted",
    "symbol": "50FTM-50USDC",
    "tokens": [
      {
        "address": "0x1fE622E91e54D6AD00B01917351Ea6081426764A",
        "symbol": "FTM",
        "weight": "0.5"
      },
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC.e",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x614c884caa52a231d74a3553fdddb0b7be53032300020000000000000000003d",
    "address": "0x614c884CaA52a231D74a3553fDdDB0b7BE530323",
    "poolType": "Weighted",
    "symbol": "20USDT.e-80SPOLAR",
    "tokens": [
      {
        "address": "0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
        "symbol": "USDT.e",
        "weight": "0.2"
      },
      {
        "address": "0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729",
        "symbol": "SPOLAR",
        "weight": "0.8"
      }
    ]
  },
  {
    "id": "0xc38d30794c44c39fe6077dc80704d2a501f2a75800020000000000000000003b",
    "address": "0xc38d30794C44c39FE6077dC80704d2a501f2a758",
    "poolType": "Weighted",
    "symbol": "20USDT.e-80pNEAR",
    "tokens": [
      {
        "address": "0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
        "symbol": "USDT.e",
        "weight": "0.2"
      },
      {
        "address": "0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6",
        "symbol": "pNEAR",
        "weight": "0.8"
      }
    ]
  },
  {
    "id": "0xdab85176672835e1efc37729540ebc24e18a742500020000000000000000003c",
    "address": "0xDAB85176672835e1EfC37729540EbC24e18a7425",
    "poolType": "Weighted",
    "symbol": "80SPOLAR-20WETH",
    "tokens": [
      {
        "address": "0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729",
        "symbol": "SPOLAR",
        "weight": "0.8"
      },
      {
        "address": "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "symbol": "WETH",
        "weight": "0.2"
      }
    ]
  },
  {
    "id": "0xe02e913a4f2e5b87b8b953ee3a26f9b4919a0306000200000000000000000040",
    "address": "0xe02e913a4f2e5b87b8b953eE3A26f9B4919A0306",
    "poolType": "Weighted",
    "symbol": "50AVAX-50USDC",
    "tokens": [
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC.e",
        "weight": "0.5"
      },
      {
        "address": "0xef3c714c9425a8F3697A9C969Dc1af30ba82e5d4",
        "symbol": "AVAX",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0x381d8ba80b9bb2b7ae09b895bcb4b0ec8d54703f000200000000000000000042",
    "address": "0x381D8Ba80B9BB2B7aE09B895BCb4B0EC8d54703F",
    "poolType": "Weighted",
    "symbol": "1pNEAR-99SPOLAR",
    "tokens": [
      {
        "address": "0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6",
        "symbol": "pNEAR",
        "weight": "0.01"
      },
      {
        "address": "0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729",
        "symbol": "SPOLAR",
        "weight": "0.99"
      }
    ]
  },
  {
    "id": "0xd2aa7c896eedc8d85a5f46b1c9fc3edbf5a7b91d000100000000000000000043",
    "address": "0xD2Aa7c896EEDc8d85A5F46B1C9FC3EdBf5a7b91d",
    "poolType": "Weighted",
    "symbol": "20FTM-30pNEAR-50SPOLAR",
    "tokens": [
      {
        "address": "0x1fE622E91e54D6AD00B01917351Ea6081426764A",
        "symbol": "FTM",
        "weight": "0.2"
      },
      {
        "address": "0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6",
        "symbol": "pNEAR",
        "weight": "0.3"
      },
      {
        "address": "0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729",
        "symbol": "SPOLAR",
        "weight": "0.5"
      }
    ]
  },
  {
    "id": "0xe84e5418432beeeb543bbcdf9fa54fd7ea3aa65b000200000000000000000049",
    "address": "0xE84e5418432BeEeB543BBcDF9fa54fd7eA3Aa65b",
    "poolType": "Weighted",
    "symbol": "60UsdStablePool-40AURORA",
    "tokens": [
      {
        "address": "0x46218d1962f39D96B9295A86D01849f36Bf52A3E",
        "symbol": "UsdStablePool",
        "weight": "0.6"
      },
      {
        "address": "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79",
        "symbol": "AURORA",
        "weight": "0.4"
      }
    ]
  },
  {
    "id": "0x46218d1962f39d96b9295a86d01849f36bf52a3e000000000000000000000047",
    "address": "0x46218d1962f39D96B9295A86D01849f36Bf52A3E",
    "poolType": "ComposableStable",
    "symbol": "UsdStablePool",
    "tokens": [
      {
        "address": "0x368EBb46ACa6b8D0787C96B2b20bD3CC3F2c45F7",
        "symbol": "USDC",
        "weight": null
      },
      {
        "address": "0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
        "symbol": "USDT.e",
        "weight": null
      },
      {
        "address": "0x80Da25Da4D783E57d2FCdA0436873A193a4BEccF",
        "symbol": "USDt",
        "weight": null
      },
      {
        "address": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
        "symbol": "USDC.e",
        "weight": null
      }
    ]
  },
  {
    "id": "0xf45db6b9ea5a531fbde51e3f2915979e9210246d00020000000000000000004a",
    "address": "0xf45DB6B9ea5A531FBdE51E3F2915979E9210246D",
    "poolType": "Weighted",
    "symbol": "30UsdStablePool-70pNEAR",
    "tokens": [
      {
        "address": "0x46218d1962f39D96B9295A86D01849f36Bf52A3E",
        "symbol": "UsdStablePool",
        "weight": "0.3"
      },
      {
        "address": "0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6",
        "symbol": "pNEAR",
        "weight": "0.7"
      }
    ]
  },
  {
    "id": "0x7c2bb9c37036912228f36449d14f0f7e19c861f200020000000000000000004b",
    "address": "0x7c2BB9C37036912228F36449d14F0f7e19c861F2",
    "poolType": "Weighted",
    "symbol": "30UsdStablePool-70Avax",
    "tokens": [
      {
        "address": "0x46218d1962f39D96B9295A86D01849f36Bf52A3E",
        "symbol": "UsdStablePool",
        "weight": "0.3"
      },
      {
        "address": "0xef3c714c9425a8F3697A9C969Dc1af30ba82e5d4",
        "symbol": "AVAX",
        "weight": "0.7"
      }
    ]
  },
  {
    "id": "0x6f6b70c5b9731fe5e4b1ade898dbb50a23dcb61600020000000000000000004c",
    "address": "0x6F6B70C5b9731fE5E4b1AdE898dbB50a23DCb616",
    "poolType": "Weighted",
    "symbol": "70FTM-30UsdStablePool",
    "tokens": [
      {
        "address": "0x1fE622E91e54D6AD00B01917351Ea6081426764A",
        "symbol": "FTM",
        "weight": "0.7"
      },
      {
        "address": "0x46218d1962f39D96B9295A86D01849f36Bf52A3E",
        "symbol": "UsdStablePool",
        "weight": "0.3"
      }
    ]
  },
  {
    "id": "0x1ed3bbef2de9fb1b50827a27ee591f09c1ebda9a00020000000000000000004d",
    "address": "0x1eD3bbEf2De9fb1B50827A27ee591F09c1eBDa9a",
    "poolType": "Weighted",
    "symbol": "30UsdStablePool-70WETH",
    "tokens": [
      {
        "address": "0x46218d1962f39D96B9295A86D01849f36Bf52A3E",
        "symbol": "UsdStablePool",
        "weight": "0.3"
      },
      {
        "address": "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "symbol": "WETH",
        "weight": "0.7"
      }
    ]
  },
  {
    "id": "0xde394782872384aec124ffc034c065efe1979d8d00020000000000000000004f",
    "address": "0xdE394782872384aEc124fFc034C065EfE1979d8D",
    "poolType": "Weighted",
    "symbol": "30UsdStablePool-70WBTC",
    "tokens": [
      {
        "address": "0x46218d1962f39D96B9295A86D01849f36Bf52A3E",
        "symbol": "UsdStablePool",
        "weight": "0.3"
      },
      {
        "address": "0xF4eB217Ba2454613b15dBdea6e5f22276410e89e",
        "symbol": "WBTC",
        "weight": "0.7"
      }
    ]
  },
  {
    "id": "0x01aa7c6ae7d654a669919be766132fe3eafc8ba900020000000000000000004e",
    "address": "0x01Aa7C6aE7D654A669919Be766132Fe3eaFc8ba9",
    "poolType": "Weighted",
    "symbol": "70SOL-30UsdStablePool",
    "tokens": [
      {
        "address": "0x0f00576d07B594Bdc1caf44b6014A6A02E5AFd48",
        "symbol": "SOL",
        "weight": "0.7"
      },
      {
        "address": "0x46218d1962f39D96B9295A86D01849f36Bf52A3E",
        "symbol": "UsdStablePool",
        "weight": "0.3"
      }
    ]
  },
  {
    "id": "0x35ff4a0b0d1bf6550e7c4c548f93afec489ae50e000200000000000000000050",
    "address": "0x35fF4A0b0D1BF6550e7C4C548f93AfeC489aE50e",
    "poolType": "Weighted",
    "symbol": "30UsdStablePool-70abBNB",
    "tokens": [
      {
        "address": "0x46218d1962f39D96B9295A86D01849f36Bf52A3E",
        "symbol": "UsdStablePool",
        "weight": "0.3"
      },
      {
        "address": "0xb14674C7264eC7d948B904Aab2c0E0F906F6e762",
        "symbol": "abBNB",
        "weight": "0.7"
      }
    ]
  },
  {
    "id": "0x23a15f4a31c567619388b3234a73921d72cabe3a000200000000000000000053",
    "address": "0x23a15f4A31C567619388B3234A73921D72cABE3a",
    "poolType": "Weighted",
    "symbol": "50SOL-50WETH",
    "tokens": [
      {
        "address": "0x0f00576d07B594Bdc1caf44b6014A6A02E5AFd48",
        "symbol": "SOL",
        "weight": "0.5"
      },
      {
        "address": "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
        "symbol": "WETH",
        "weight": "0.5"
      }
    ]
  }
];

/**
 * Find a pool containing both tokens for direct swap.
 * Returns undefined if no pool exists with both tokens.
 */
export function findPoolForTokenPair(tokenIn: string, tokenOut: string): AuroraPool | undefined {
  const tokenInLower = tokenIn.toLowerCase();
  const tokenOutLower = tokenOut.toLowerCase();
  
  return AURORA_POOLS.find(pool => {
    const tokenAddresses = pool.tokens.map(t => t.address.toLowerCase());
    return tokenAddresses.includes(tokenInLower) && tokenAddresses.includes(tokenOutLower);
  });
}

/**
 * Get all unique tokens that can be swapped across all pools.
 */
export function getAllSwappableTokens(): string[] {
  const tokens = new Set<string>();
  AURORA_POOLS.forEach(pool => {
    pool.tokens.forEach(t => tokens.add(t.address));
  });
  return Array.from(tokens);
}

/**
 * Get all pools that contain a specific token.
 */
export function getPoolsForToken(tokenAddress: string): AuroraPool[] {
  const tokenLower = tokenAddress.toLowerCase();
  return AURORA_POOLS.filter(pool => 
    pool.tokens.some(t => t.address.toLowerCase() === tokenLower)
  );
}

/**
 * Get all tokens that can be swapped with a given token.
 */
export function getSwappableTokensFor(tokenAddress: string): string[] {
  const pools = getPoolsForToken(tokenAddress);
  const tokens = new Set<string>();
  const tokenLower = tokenAddress.toLowerCase();
  
  pools.forEach(pool => {
    pool.tokens.forEach(t => {
      if (t.address.toLowerCase() !== tokenLower) {
        tokens.add(t.address);
      }
    });
  });
  
  return Array.from(tokens);
}

