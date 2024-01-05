import UserData from "@/components/UserData"
import axios from "axios"
import { UserEventWithTrainingsProps } from "./api/users/route"

export default async function Home() {
  const usersData = await getAllUsers()
  const users: UserEventWithTrainingsProps[] = usersData || []

  async function getAllUsers() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL!}api/users/`
      )
      const users: UserEventWithTrainingsProps[] = await response.data.data
      return users
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="flex flex-col items-center max-w-6xl mx-auto">
      {users.length > 0 &&
        users.map((user: UserEventWithTrainingsProps, index: number) => (
          <UserData
            key={index}
            userId={user.userId}
            userName={user.userName}
            trainings={user.trainings}
            timestamp={user.timestamp}
            lastTrainingTimestamp={user.lastTrainingTimestamp}
          />
        ))}
    </main>
  )
}
