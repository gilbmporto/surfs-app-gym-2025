import { setContractUp } from "@/utils"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ message: "Hey", data: params.id }, { status: 200 })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surfsGym = await setContractUp()

    const tx = await surfsGym.incrementUserTrainings(params.id)
    const receipt = await tx.wait()

    return NextResponse.json(
      {
        message: "Number of trainings was successfully incremented",
        data: receipt,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        message: `${error.name}: ${error.message}`,
      },
      { status: 500 }
    )
  }
}
