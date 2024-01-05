import { ethers } from "ethers"
import ABI from "../constants/SurfsGymABI.json"

export function toJson(data: any) {
  if (data !== undefined) {
    return JSON.stringify(data, (_, v) =>
      typeof v === "bigint" ? `${v}#bigint` : v
    ).replace(/"(-?\d+)#bigint"/g, (_, a) => a)
  }
}

export function toCorrectForm(data: any) {
  if (data !== undefined) {
    return data.replace("[", "").replace("]", "").replace(/"/g, "").split(",")
  }
}

export function isEventLog(
  log: ethers.EventLog | ethers.Log
): log is ethers.EventLog {
  return "args" in log
}

export function convertTimestampToDate(timestamp: string) {
  // Create a new Date object from the timestamp (multiplied by 1000 to convert seconds to milliseconds)
  const date = new Date(Number(timestamp) * 1000)

  // Format the date and time
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0") // getMonth() returns 0-11
  const year = date.getFullYear()

  return `${hours}:${minutes} ${day}/${month}/${year}`
}

export async function setContractUp() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!)
  const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL!)
  const walletWithProvider = wallet.connect(provider)
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS!,
    ABI,
    walletWithProvider
  )

  return contract
}

export const getFirstBlock = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL!)
  const receipt = await provider.getTransactionReceipt(
    process.env.DEPLOYMENT_TRANSACTION_HASH!
  )
  return receipt?.blockNumber
}

export const getLatestBlock = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL!)
  const block = await provider.getBlock("latest")
  return block?.number
}

export const getEvents = async (event: string) => {
  const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL!)
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS!,
    ABI,
    provider
  )
  const rawEvents = await contract.queryFilter(
    event,
    await getFirstBlock(),
    await getLatestBlock()
  )

  const events = rawEvents.filter(isEventLog)
  return events
}

export const getUserEvents = async (event: string, name: string) => {
  const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL!)
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS!,
    ABI,
    provider
  )
  const rawEvents = await contract.queryFilter(
    event,
    await getFirstBlock(),
    await getLatestBlock()
  )
  const events = rawEvents
    .filter(isEventLog)
    .filter((e) => e.args.userName === name)
    .sort((a, b) => a.blockNumber - b.blockNumber)
  return events
}
