"use client"
import UserData from "@/components/UserData"
import { UserEventWithTrainingsProps } from "./api/users/route"
import axios from "axios"
import { useEffect, useState } from "react"

export const fetchCache = "force-no-store"

export default function Home() {
  const [usersData, setUsersData] = useState<UserEventWithTrainingsProps[]>([])

  useEffect(() => {
    getAllUsers()
  }, [])

  async function getAllUsers() {
    try {
      const response = await axios.get(`${window.location.origin}/api/users/`, {
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      console.log(window.location.origin)
      const data = response.data.data
      setUsersData(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="flex flex-col items-center max-w-6xl mx-auto">
      {usersData.length > 0 ? (
        usersData.map((user: UserEventWithTrainingsProps, index: number) => (
          <UserData
            key={index}
            userId={user.userId}
            userName={user.userName}
            trainings={user.trainings}
            timestamp={user.timestamp}
            lastTrainingTimestamp={user.lastTrainingTimestamp}
          />
        ))
      ) : (
        <h2 className="text-3xl text-white text-center">
          Carregando usuários...
        </h2>
      )}
    </main>
  )
}
