"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

const { getRootProps, getInputProps } = useDropzone({
  onDrop,
  accept: {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
});

  const uploadFile = async () => {
  if (!file) return;

  try {

    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {

      throw new Error(
        result.message || "Upload gagal"
      );

    }

    alert("Upload berhasil!");

    console.log(result);

  } catch (error) {

    console.log(error);

    alert("Upload gagal");

  } finally {

    setLoading(false);

  }
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-125">
        <h1 className="text-2xl font-bold mb-5">
          Upload FAQ Excel
        </h1>

        <div
          {...getRootProps()}
          className="border-2 border-dashed p-10 rounded-lg cursor-pointer text-center"
        >
          <input {...getInputProps()} />

          {file ? (
            <p>{file.name}</p>
          ) : (
            <p>Drag & Drop Excel Here</p>
          )}
        </div>

        <button
          onClick={uploadFile}
          disabled={loading}
          className="mt-5 bg-black text-white px-5 py-2 rounded-lg w-full"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </main>
  );
}