import { getEvents, getUserEvents } from "@/utils"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export type CreatedUserEventProps = {
  userId: string
  userName: string
  timestamp: string
}

export type UserEventWithTrainingsProps = {
  userId: string
  userName: string
  timestamp: string
  trainings: string
  lastTrainingTimestamp: string
}
export async function GET(req: NextRequest) {
  try {
    const events = await getEvents("NewUserCreated")
    const users = events.map((e) => {
      return {
        userId: e.args.id.toString(),
        userName: e.args.userName,
        timestamp: e.args.timestamp.toString(),
      } as CreatedUserEventProps
    })

    // Use Promise.all to wait for all getUserEvents calls to resolve
    const usersWithTrainingsPromises = users.map(async (user) => {
      const userEvents = await getUserEvents(
        "TrainingIncremented",
        user.userName
      )
      if (userEvents.length !== 0) {
        return {
          ...user,
          trainings:
            userEvents[userEvents.length - 1]?.args?.trainings.toString(),
          lastTrainingTimestamp:
            userEvents[userEvents.length - 1]?.args?.timestamp.toString(),
        }
      } else {
        return {
          ...user,
          trainings: "0",
          lastTrainingTimestamp: "",
        }
      }
    })

    let usersWithTrainings = await Promise.all(usersWithTrainingsPromises)

    // Sort the users based on the quantity of trainings
    usersWithTrainings = usersWithTrainings.sort((a, b) => {
      // Convert trainings to numbers for comparison
      const trainingsA = parseInt(a.trainings)
      const trainingsB = parseInt(b.trainings)

      // Sort in descending order
      return trainingsB - trainingsA
    })

    return NextResponse.json(
      { message: "Data was successfully fetched!", data: usersWithTrainings },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    )
  }
}
