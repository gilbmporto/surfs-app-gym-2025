"use client"
export const dynamic = "force-dynamic"
import UserData from "@/components/UserData"
import { UserEventWithTrainingsProps } from "./api/users/route"
import { useEffect, useState } from "react"
import axios from "axios"
import { revalidatePath } from "next/cache"

export default function Home() {
  const [usersData, setUsersData] = useState<UserEventWithTrainingsProps[]>([])

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
      console.log(window.location.origin)
      const data = response.data.data
      setUsersData(data)
      revalidatePath("/")
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
