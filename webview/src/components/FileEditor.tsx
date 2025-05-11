"use client";

import { useState } from "react";
import { type CodeFile } from "../lib/types";
import { FileGrid } from "./FileGrid";
import { EditorDialog } from "./EditorDialog";
import axios from 'axios';

interface FileEditorProps {
  files: CodeFile[];
}

export function FileEditor({ files }: FileEditorProps) {
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value && selectedFile) {
      setCode(value);
    }
  };

  const handleRun = async (inputs?: Record<string, any>) => {
    setIsRunning(true);
    setResult(""); // Clear previous results

    try {
      // Extract command details from code if it contains "call function"
      const message = {
        role: "user",
        content: code
      };

      const requestData = {
        messages: [message],
        show_intermediate_steps: false
      };

      // Log the request
      console.log('🤖 Calling AI with data:', {
        content: code,
        inputs: inputs
      });

      const response = await axios.post("http://localhost:3000/api",
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle plain text response
      if (typeof response.data === 'string') {
        console.log('📝 Received plain text response:', response.data);
        setResult(response.data);
      }
      // Handle stream response
      else if (response.data.getReader) {
        console.log('📡 Receiving streaming response...');
        const reader = response.data.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setResult(prev => prev + chunk);
        }

        console.log('📦 Complete stream response:', fullResponse);
      }

    } catch (error) {
      console.error("❌ Error running code:", error);
      if (axios.isAxiosError(error)) {
        console.error("🔍 Response details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      setResult(
        `Error: ${axios.isAxiosError(error) ? error.message : "Unknown error occurred"}`
      );
    } finally {
      console.log('✅ AI call completed');
      setIsRunning(false);
    }
  };

  const openFile = (file: CodeFile) => {
    setSelectedFile(file);
    setCode(file.content);
    setResult("");
    setIsRunning(false);
    console.log("check monaco editor", file.content);
  };

  const closeFile = () => {
    setSelectedFile(null);
    setCode("");
    setResult("");
    setIsRunning(false);
  };

  return (
    <>
      <FileGrid files={files} onFileSelect={openFile} />

      <EditorDialog
        file={selectedFile}
        code={code}
        result={result}
        isRunning={isRunning}
        onClose={closeFile}
        onCodeChange={handleEditorChange}
        onRun={handleRun}
        onBack={() => setResult("")}
      />
    </>
  );
}
