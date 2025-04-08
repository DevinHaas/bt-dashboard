"use server";

import * as Minio from "minio";
import { NextResponse } from "next/server";
import Busboy from "busboy";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

const minioClient = new Minio.Client({
  endPoint: "minio-n8gg0g0w44o84oos0cs84o8w.bleat.ch",
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const busboy = Busboy({ headers: { "content-type": contentType } });

  const fields: Record<string, string> = {};
  const files: { filename: string; buffer: Buffer; mimeType: string }[] = [];

  return new Promise<Response>((resolve, reject) => {
    busboy.on("field", (name, val) => {
      fields[name] = val;
    });

    busboy.on("file", (name, fileStream, info) => {
      const { filename, mimeType } = info;
      const chuncks: Buffer[] = [];

      fileStream.on("data", (chunck) => chuncks.push(chunck));
      fileStream.on("end", () => {
        files.push({
          filename,
          buffer: Buffer.concat(chuncks),
          mimeType: mimeType,
        });
      });
    });

    busboy.on("finish", async () => {
      try {
        await Promise.all(
          files.map((file, index) =>
            minioClient.putObject(
              `${process.env.MINIO_BUCKET}`,
              `${fields.userId}/${fields.date}/${file.filename}-${index}`,
              file.buffer,
              file.buffer.length,
              { "Content-Type": file.mimeType },
            ),
          ),
        );
        resolve(NextResponse.json({ message: "Uploaded!" }));
      } catch (err) {
        reject(
          NextResponse.json({ error: "Failed to upload" }, { status: 500 }),
        );
      }
    });
    const readable = Readable.fromWeb(
      request.body as unknown as ReadableStream<unknown>,
    );
    readable.pipe(busboy);
  });
}
