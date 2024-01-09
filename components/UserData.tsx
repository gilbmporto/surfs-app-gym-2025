"use client"
export const dynamic = "force-dynamic"
import { useState } from "react"
import { UserEventWithTrainingsProps } from "@/app/api/users/route"
import { convertTimestampToDate } from "@/utils"
import axios from "axios"

export default function UserData({
  userId = "1",
  userName = "User",
  trainings = "0",
  lastTrainingTimestamp = "",
}: UserEventWithTrainingsProps) {
  const [trainingsQty, setTrainingsQty] = useState<number>(Number(trainings))
  const [loading, setLoading] = useState<boolean>(false)
  const [lastTimeStamp, setLastTimeStamp] = useState<string>(
    lastTrainingTimestamp
  )

  async function handleIncrementTraining() {
    try {
      const confirmAdd = window.confirm("Quer adicionar um novo treino?")
      if (confirmAdd) {
        setLoading(true)
        const response = await axios.put(
          `api/users/${userId}?timestamp=${new Date().getTime()}`,
          {
            Headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
            setTimeout: 18000,
          }
        )

        if (response.status === 200) {
          const data = response.data.data
          setTrainingsQty(trainingsQty + 1)
          setLastTimeStamp((Date.now() / 1000).toString())
          return data
        }
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl sm:w-full w-60 my-4 border bg-slate-300 rounded-xl flex flex-col sm:flex-row items-center justify-between p-4 text-black gap-5">
      <div className="flex sm:flex-row items-center w-52 sm:w-36 sm:justify-center justify-between pl-2 sm:gap-2">
        <h2
          className={`w-20 ${
            userName.length > 13 ? `sm:w-24` : `sm:w-20`
          } text-lg `}
        >
          {userName}
        </h2>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl 
            ${
              loading
                ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          disabled={loading}
          onClick={handleIncrementTraining}
        >
          +
        </button>
      </div>
      <div
        className={`text-center flex sm:flex-col w-52 sm:w-20 ${
          loading ? `flex-col items-center` : `justify-between`
        }`}
      >
        <p className={`text-xl text-center ${loading ? "w-40 " : "w-20"}`}>
          Treinos
        </p>
        {loading ? (
          <p className="text-lg text-green-700 pr-4 sm:pr-0">Aguarde...</p>
        ) : (
          <p className="text-lg pr-4 sm:pr-0">{trainingsQty}</p>
        )}
      </div>

      <div className="flex flex-col items-center sm:items-end text-lg">
        <p className="text-center">Última vez que treinou:</p>

        {loading ? (
          <p className="text-lg text-green-700">Aguarde...</p>
        ) : (
          <p className="text-lg text-red-500">
            {lastTimeStamp === "" ? "" : convertTimestampToDate(lastTimeStamp)}
          </p>
        )}
      </div>
    </div>
  )
}
