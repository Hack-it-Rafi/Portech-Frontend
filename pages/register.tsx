import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from 'next/navigation';

import { Capacitor } from "@capacitor/core";
import { WebAuthn } from "@darkedges/capacitor-native-webauthn";
import base64url from "base64url";
import { privateToPublic, publicToAddress, toChecksumAddress } from 'ethereumjs-util';

import { toast } from 'react-toastify';

import { Button } from "@/components";
import  useStore  from '@/hooks/useCredentials'
import { useAppContext } from "@/utils/context";
import { Types } from "@requestnetwork/request-client.js";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useAuth } from "@/customComponents/isLoggedInProvider";

const RegisterPage: React.FC = () => {
  
  const { requestNetwork } = useAppContext();
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);
  const fixedIV = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const { setPrvKey, setAddress } = useStore()
  const { loggedIn, setLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function getData(){
      const reqData = await requestNetwork?.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: "0xf089808947e00a59667f06e45e6c6daf796cf75c",
      }
      );
      console.log({reqData}
    )
    }
    getData();
  })

  async function signMessage(message: string, privateKey: string): Promise<string> {
    try {
      // Create a wallet instance from the private key
      const wallet = new ethers.Wallet(privateKey);
  
      // Sign the message
      const signature = await wallet.signMessage(message);
  
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  const genRand = (len: number): string => {
    return Math.random().toString(36).substring(2,len+2);
  }

  const generateKeyPair = async (seed: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(seed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Convert the hash to a Buffer
    const privateKeyBuffer = Buffer.from(hashHex, 'hex');
    
    // Generate the public key from the private key
    const publicKeyBuffer = privateToPublic(privateKeyBuffer);
    
    // Generate the Ethereum address from the public key
    const addressBuffer = publicToAddress(publicKeyBuffer);
    
    // Convert the private key, public key, and address to hexadecimal strings
    const privateKey = privateKeyBuffer.toString('hex');
    const publicKey = publicKeyBuffer.toString('hex');
    const address = toChecksumAddress('0x' + addressBuffer.toString('hex'));
    
    return {
      privateKey: '0x' + privateKey,
      publicKey: '0x' + publicKey,
      address: address
    };
  };

  const generateAESKey = async (password: string): Promise<CryptoKey> => {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const encryptMessage = async (pass: string, message: string) => {
    const encoder = new TextEncoder();
      const key = await generateAESKey(pass);
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: fixedIV
        },
        key,
        encoder.encode(message)
      );
      return Array.from(new Uint8Array(encryptedData))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  function isValidEVMPrivateKey(key: string) {
    // Remove '0x' prefix if present
    const cleanKey = key.startsWith('0x') ? key.slice(2) : key;
    
    // Check if it's 64 characters long
    if (cleanKey.length !== 64) {
      return false;
    }
    
    // Check if it only contains valid hexadecimal characters
    const hexRegex = /^[0-9a-fA-F]+$/;
    if (!hexRegex.test(cleanKey)) {
      return false;
    }
    
    return true;
  }

  const decryptMessage = async (pass: string, encryptedMsg: string) => {
    const key = await generateAESKey(pass);
    const encryptedData = new Uint8Array(encryptedMsg.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: fixedIV
      },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  }

  async function getBrowserFingerprint(): Promise<string> {
    // Initialize an agent at application startup.
    const fp = await FingerprintJS.load();
  
    // Get the visitor identifier when you need it.
    const result = await fp.get();
  
    // This is the visitor identifier:
    const visitorId = result.visitorId;
    console.log('Browser Fingerprint:', visitorId);
  
    return visitorId;
  }

  const onRegister = async () => {
    try {
      setLoadingRegister(true);

      const privateKey = localStorage.getItem("pt:privateEncrypted")

      if (privateKey) {
        toast("Already registered")
        return;
      }
      let response;
      
        response = await WebAuthn.startRegistration({
          challenge: base64url("createchallenge"),
          rp: {
            id: Capacitor.isNativePlatform()
              ? "localhost:3000"
              : undefined,
            name: "PortechPass",
          },
          user: {
            id: base64url("Portech"),
            name: "Portech",
            displayName: "Portech",
          },
          authenticatorSelection: {
            requireResidentKey: true,
            residentKey:
              Capacitor.getPlatform() === "android"
                ? "preferred"
                : "discouraged",
            userVerification: "discouraged",
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          attestation: "direct",
        });

      const pass = response.id;

      // getRand => salt
      const keyPairs = await generateKeyPair(pass+genRand(11))
      const signature = await signMessage("Portech", keyPairs.privateKey);
      const encryptedMessage = await encryptMessage(pass, keyPairs.privateKey);  
      const fp = await getBrowserFingerprint()
      const apiResponse = await fetch('/api/cred', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ signature: signature, browserFp: fp }),
        })
      
      const resJson =  await apiResponse.json()

      const link = `https://sepolia.etherscan.io/tx/${resJson.txHash}`
      if (resJson.success) {
        toast.info(
          <div>
           <h3>Registration successful ✅</h3>
           <a href={link} target="_blank" rel="noopener noreferrer">Tx Hash Link</a>
           </div>
        )
        localStorage.setItem("pt:privateEncrypted", encryptedMessage);
        localStorage.setItem("pt:address", keyPairs.address);
      }
      else{
        toast("Registration failed ❌")
      }
    } catch (error) {
      console.error(error);
      toast("Registration failed ❌")
    } finally {
      setLoadingRegister(false);
    }
  };

  const onSign = async () => {
    try {
      const encryptedMessage = localStorage.getItem("pt:privateEncrypted")+""
      const address = localStorage.getItem("pt:address")+""
      const signRes = await WebAuthn.startAuthentication({
        challenge: base64url("PortechPass"),
        rpId: Capacitor.isNativePlatform()
          ? "localhost:3000"
          : undefined,
        userVerification: "required",
      });
  
      const pass = signRes.id;
      console.log({pass});
      
      const decryptedMessage = (await decryptMessage(pass, encryptedMessage)) as string;
      console.log(decryptMessage);
      const signature = await signMessage("Portech", decryptedMessage);
      if(!isValidEVMPrivateKey(decryptedMessage) ){
        toast("Login failed ❌");
        return;
      }
      console.log("Done..");
      
      const fp = await getBrowserFingerprint()
      // Maybe do signature verification with this -> maybe this means on register call a smart contract browser fingerprint to -> signature of "Portech"
      const response = await fetch(`/api/cred/?fp=${fp}`);
      const resJson = await response.json();
      console.log({resJson});
      
      if(resJson.signature === signature){
        setPrvKey(decryptedMessage);
        setAddress(address);
        toast("Login successful ✅");
        setLoggedIn(true);
        console.log("Login successful");
        router.push('/');
      }
      else{
        toast("Login failed ❌")
      }
    } catch (error) {
      console.error(error);
      toast("Login failed ❌")
    } finally {
      setLoadingSign(false);
    }
  };

  return (
    <div className="mt-20">
      <div className="flex justify-center gap-56">
        <Button
          text="Register"
          disabled={loadingRegister || loadingSign}
          onClick={() => {
            onRegister();
          }}
          loading={loadingRegister}
        />
       
        <Button
          text="Sign In"
          disabled={loadingRegister || loadingSign}
          onClick={() => {
            onSign();
          }}
          loading={loadingSign}
        />
      </div>
    </div>
  );
};

export default RegisterPage;