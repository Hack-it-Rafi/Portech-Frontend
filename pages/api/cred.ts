
import { NextApiRequest, NextApiResponse } from 'next';
import contractABI from '../../abi/register.json';
import { ethers } from 'ethers';
// Import environment variable


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY+"";
  const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contractAddress = '0x400d87a453451082d65c864a30370a4422ad1Ccf';
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);
  if (req.method === 'POST') {
    console.log({RPC_URL});
    // Call a state-changing function
    const tx = await contract.registerDevice(req.body.browserFp, req.body.signature);
    await tx.wait(); // Wait for the transaction to be mined
    console.log('Transaction completed');
    res.status(200).json({ message: `Successfully registered`, success: true, txHash: tx.hash });
  } else if(req.method === 'GET'){
    // Call a read-only function (view/pure)
    const result = await contract.getSignature(req.query.fp);
    res.status(200).json({ signature: result });
  }
  else {
    res.setHeader('Allow', ['GET']);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}