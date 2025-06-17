'use client';

import useFetchHandlers from "@/APIs/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    HandleStudentsFetching, 
    HandleStudentInsertion, 
    HandleStudentDeletion, 
    HandleStudentUpdate 
  } = useFetchHandlers();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await HandleStudentsFetching(setStudentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [HandleStudentsFetching]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      alert("Please fill in both fields");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && editingStudent) {
        await HandleStudentUpdate(name, email, editingStudent.id);
        setIsEditMode(false);
        setEditingStudent(null);
      } else {
        await HandleStudentInsertion(
          { name: name.trim(), email: email.trim() }, 
          HandleStudentsFetching, 
          setName, 
          setEmail, 
          setStudentsData
        );
      }
      
      // Clear form
      setName("");
      setEmail("");
      
      // Refresh data
      await HandleStudentsFetching(setStudentsData);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setEmail(student.email);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingStudent(null);
    setName("");
    setEmail("");
  };

  const handleDelete = async (studentId: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    
    setIsLoading(true);
    try {
      await HandleStudentDeletion(studentId, HandleStudentsFetching, setStudentsData);
      await HandleStudentsFetching(setStudentsData);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditMode) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={handleCancelEdit}
              className="mr-4 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-2xl font-bold text-white">Edit Student</h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-lg p-8 shadow-lg space-y-6"
            autoComplete="off"
          >
            <div>
              <label htmlFor="edit-name" className="block mb-2 text-gray-300 font-medium">
                Name
              </label>
              <Input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student name"
                className="bg-gray-900 text-gray-100 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md transition"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="edit-email" className="block mb-2 text-gray-300 font-medium">
                Email
              </label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter student email"
                className="bg-gray-900 text-gray-100 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md transition"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Update Student"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="px-6 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">
          Student Management System
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Student List */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 text-white">Students ({studentsData.length})</h2>
            
            {isLoading ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">Loading students...</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg shadow-lg max-h-[600px] overflow-y-auto">
                {studentsData.length > 0 ? (
                  <ul className="divide-y divide-gray-700">
                    {studentsData.map((student) => (
                      <li
                        key={student.id}
                        className="p-6 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-white mb-1">
                              {student.name}
                            </h3>
                            <p className="text-sm text-gray-300 truncate">
                              {student.email}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(student)}
                              disabled={isLoading}
                              className="border-gray-600 text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(student.id)}
                              disabled={isLoading}
                              className="border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 italic">No students found.</p>
                    <p className="text-gray-600 text-sm mt-2">Add your first student using the form.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add Student Form */}
          <div className="flex-1 lg:max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Add New Student</h2>
            
            <form
              onSubmit={handleSubmit}
              className="bg-gray-800 rounded-lg p-8 shadow-lg space-y-6"
              autoComplete="off"
            >
              <div>
                <label htmlFor="name" className="block mb-2 text-gray-300 font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter student name"
                  className="bg-gray-900 text-gray-100 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md transition"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-gray-300 font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter student email"
                  className="bg-gray-900 text-gray-100 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md transition"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding..." : "Add Student"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}