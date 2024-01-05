"use client"
import UserData from "@/components/UserData"
import { UserEventWithTrainingsProps } from "./api/users/route"
import { useEffect, useState } from "react"

export default function Home() {
  const [usersData, setUsersData] = useState<UserEventWithTrainingsProps[]>([])

  useEffect(() => {
    fetchAllUsers()
  }, [])

  async function fetchAllUsers() {
    try {
      const res = await fetch(`${window.location.origin}/api/users`, {
        next: {
          revalidate: 0,
        },
      })
      const data = await res.json()

      setUsersData(data.data)
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
