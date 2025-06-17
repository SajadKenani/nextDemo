import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await prisma.new_student_account.findMany({
      orderBy: {
        id: "asc",
      }
    });
    return NextResponse.json({ students });
  } catch (error: unknown) {
    console.error("API Error:", error);
    const message = (error instanceof Error) ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, id } = await request.json();

    const newStudent = await prisma.new_student_account.create({
      data: {
        id,
        name,
        email
      },
    });

    return NextResponse.json({ newStudent });
  } catch (error: unknown) {
    console.error("API Error:", error);
    const message = (error instanceof Error) ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== 'number') {
      return NextResponse.json({ error: 'Invalid or missing id' }, { status: 400 });
    }

    await prisma.new_student_account.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Student deleted!' });
  } catch (error: unknown) {
    console.error('API Error:', error);
    const message = (error instanceof Error) ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, name, email} = await request.json();

  try {
    await prisma.new_student_account.update({
      where: {id}, 
      data: {
        name, 
        email
      }
    })
    return NextResponse.json({ message: "Student updated successfully!" });

  } catch (error) {console.log(error)}

}