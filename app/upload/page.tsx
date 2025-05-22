"use client"
import Head from "next/head";
import { MultipartFileUploader } from "@/app/components/MultipartFileUploader";
import styles from "@/app/Home.module.css";
import { UploadResult } from "@uppy/core";


export default function Home() {
  const handleUploadSuccess = (result: UploadResult) => {
    console.log('Upload successful:', result);
    
    // sau khi upload xong thì req post lưu dữ liệu vào strapi
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>R2 bucket File Uploader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Upload files to R2 bucket</h1>

        <p className={styles.description}>
          You can drag and drop file(s) or directories below to upload them into
          a blob storage bucket.
        </p>


        <hr />

        <div>
          <h3>Multipart upload</h3>
          <MultipartFileUploader
            onUploadSuccess={handleUploadSuccess} 
          />
        </div>
      </main>

    </div>
  );
}
