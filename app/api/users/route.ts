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
    const deletedUsersEvent = await getEvents("UserDeleted")
    const userNameChangedEvent = await getEvents("UserNameChanged")

    const sortedUserNameChangedEvents = userNameChangedEvent.sort((a, b) => {
      return parseInt(a.args.timestamp) - parseInt(b.args.timestamp)
    })

    let users = events
      .map((e) => {
        return {
          userId: e.args.id.toString(),
          userName: e.args.userName,
          timestamp: e.args.timestamp.toString(),
        } as CreatedUserEventProps
      })
      .filter((e) => {
        return !deletedUsersEvent.find((d) => d.args.id.toString() === e.userId)
      })

    sortedUserNameChangedEvents.forEach((changeEvent) => {
      // Find the index of the user in the users array
      const userIndex = users.findIndex(
        (user) => user.userId === changeEvent.args.id.toString()
      )

      if (userIndex !== -1) {
        // Update the userName of the user in the array
        users[userIndex].userName = changeEvent.args.newUserName
      }
    })

    // Use Promise.all to wait for all getUserEvents calls to resolve
    const usersWithTrainingsPromises = users.map(async (user) => {
      const userEvents = await getUserEvents("TrainingIncremented", user.userId)
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

    let usersWithTrainings: UserEventWithTrainingsProps[] = await Promise.all(
      usersWithTrainingsPromises
    )

    const usersWithSetTrainingsPromises = usersWithTrainings.map(
      async (user) => {
        const userSetEvents = await getUserEvents("TrainingSet", user.userId)
        if (userSetEvents.length !== 0) {
          if (
            userSetEvents[userSetEvents.length - 1]?.args?.timestamp >
            user.lastTrainingTimestamp
          ) {
            return {
              ...user,
              trainings:
                userSetEvents[
                  userSetEvents.length - 1
                ]?.args?.trainings.toString(),
              lastTrainingTimestamp:
                userSetEvents[
                  userSetEvents.length - 1
                ]?.args?.timestamp.toString(),
            }
          } else {
            return {
              ...user,
            }
          }
        } else {
          return {
            ...user,
          }
        }
      }
    )

    usersWithTrainings = await Promise.all(usersWithSetTrainingsPromises)

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
