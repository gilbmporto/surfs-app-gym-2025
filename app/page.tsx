import UserData from "@/components/UserData"
import { UserEventWithTrainingsProps } from "./api/users/route"

export default async function Home() {
  const usersData = await getAllUsers()
  const users: UserEventWithTrainingsProps[] = usersData || []

  async function getAllUsers() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_URL!}api/users/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const data = await response.json()
      return data.data
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="flex flex-col items-center max-w-6xl mx-auto">
      {users.length > 0
        ? users.map((user: UserEventWithTrainingsProps, index: number) => (
            <UserData
              key={index}
              userId={user.userId}
              userName={user.userName}
              trainings={user.trainings}
              timestamp={user.timestamp}
              lastTrainingTimestamp={user.lastTrainingTimestamp}
            />
          ))
        : null}
    </main>
  )
}
