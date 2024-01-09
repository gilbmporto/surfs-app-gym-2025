"use client"
export const dynamic = "force-dynamic"
import UserData from "@/components/UserData"
import { UserEventWithTrainingsProps } from "./api/users/route"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Home() {
  const [usersData, setUsersData] = useState<UserEventWithTrainingsProps[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    getAllUsers()
  }, [])

  async function getAllUsers() {
    try {
      const response = await axios.get(
        `api/users?timestamp=${new Date().getTime()}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      )
      console.log(response.data)
      const data = response.data.data
      setUsersData(data)
    } catch (error) {
      console.log(error)
      setErrorMessage("Erro. Atualize a página e tente novamente.")
    }
  }

  return (
    <main className="flex flex-col items-center max-w-6xl mx-auto">
      <button
        className="px-4 py-2 text-lg text-white rounded-xl bg-green-600 hover:bg-green-700 cursor-pointer mb-4"
        onClick={() => location.reload()}
      >
        Atualizar
      </button>
      {errorMessage ? <p className="text-red-500">{errorMessage}</p> : null}
      {errorMessage ? null : usersData.length > 0 ? (
        usersData.map((user: UserEventWithTrainingsProps, index: number) => {
          if (user.userId === "0") {
            return null
          }

          return (
            <UserData
              key={index}
              userId={user.userId}
              userName={user.userName}
              trainings={user.trainings}
              timestamp={user.timestamp}
              lastTrainingTimestamp={user.lastTrainingTimestamp}
            />
          )
        })
      ) : (
        <h2 className="text-3xl text-white text-center">
          Carregando usuários...
        </h2>
      )}
    </main>
  )
}
