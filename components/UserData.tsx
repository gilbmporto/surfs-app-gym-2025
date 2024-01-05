"use client"
import { useState } from "react"
import { UserEventWithTrainingsProps } from "@/app/api/users/route"
import { convertTimestampToDate } from "@/utils"

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}api/users/${userId}`,
          {
            method: "PUT",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            next: {
              revalidate: 0,
            },
          }
        )
        const data = await res.json()

        if (
          (data.message = "Number of trainings was successfully incremented")
        ) {
          setTrainingsQty(trainingsQty + 1)
          setLastTimeStamp((Date.now() / 1000).toString())
        }

        console.log(data)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl w-full my-4 border bg-slate-300 rounded-xl flex flex-col sm:flex-row items-center justify-between text-black p-4 sm:gap-5 gap-4">
      <div className="flex sm:flex-row items-center w-40 sm:w-36 sm:justify-center justify-between pl-2 sm:gap-2">
        <h2 className="w-20">{userName}</h2>
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
        className={`text-center flex sm:flex-col w-40 sm:w-20 ${
          loading ? `flex-col items-center` : `justify-between`
        }`}
      >
        <p className={`text-xl text-center ${loading ? "w-40 " : "w-20"}`}>
          Treinos
        </p>
        {loading ? (
          <p className="text-lg text-green-700">Aguarde...</p>
        ) : (
          <p className="text-lg">{trainingsQty}</p>
        )}
      </div>

      <div className="flex flex-col items-end">
        <p className="text-center text-sm sm:text-base">
          Última vez que treinou:
        </p>

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
