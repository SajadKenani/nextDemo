import { useCallback } from "react";
import { DELETE, GET, POST, PUT } from "./requests";

interface Student {
    id: number;
    name: string;
    email: string;
}

const useFetchHandlers = () => {
    const HandleStudentsFetching = useCallback(async (
        setStudentsData: React.Dispatch<React.SetStateAction<Student[]>>
    ) => {
        try {
            const response = GET("api/students");
            const data: unknown = await response;
            if (
                typeof data === "object" &&
                data !== null &&
                "students" in data &&
                Array.isArray((data).students)
            ) {
                console.log("Fetched students:", (data as { students: Student[] }).students);
                setStudentsData((data as { students: Student[] }).students);
            } else {
                console.error("Fetched data is not in expected format:", data);
            }
        } catch (error) {
            console.error("Failed to fetch students:", error);
        }
    }, []);

    const HandleStudentInsertion = async (
        student: { name: string; email: string },
        HandleStudentsFetching: (setStudentsData: React.Dispatch<React.SetStateAction<Student[]>>) => Promise<void>,
        setName: React.Dispatch<React.SetStateAction<string>>,
        setEmail: React.Dispatch<React.SetStateAction<string>>,
        setStudentsData: React.Dispatch<React.SetStateAction<Student[]>>
    ) => {
        try {
            const result: unknown = await POST("api/students", student);
            if (
                typeof result === "object" &&
                result !== null &&
                "newStudent" in result
            ) {
                console.log("Student saved:", (result as { newStudent: Student }).newStudent);
            } else {
                console.error("Result does not have expected 'newStudent' property:", result);
            }

            HandleStudentsFetching(setStudentsData);
            setName("");
            setEmail("");
        } catch (error) {
            console.error("Error sending student data:", error);
        }
    };

    const HandleStudentDeletion = useCallback(
        async (
            id: number,
            HandleStudentsFetching: (setStudentsData: React.Dispatch<React.SetStateAction<Student[]>>) => Promise<void>,
            setStudentsData: React.Dispatch<React.SetStateAction<Student[]>>
        ) => {
            try {
                await DELETE(`api/students`, { id });
            } catch (error) { console.log(error) }
            finally {
                HandleStudentsFetching(setStudentsData)
            }
        }, []
    )

    const HandleStudentUpdate = useCallback(async (name: string, email: string, id: number) => {
        try {
            await PUT("api/students", { name, email, id })
        } catch (error) { console.log(error) }
    }, [])

    return {
        HandleStudentsFetching,
        HandleStudentInsertion,
        HandleStudentDeletion,
        HandleStudentUpdate
    };
};

export default useFetchHandlers;
