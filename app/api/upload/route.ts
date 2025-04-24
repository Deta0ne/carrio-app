import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import path from "path";
import os from "os";

// Karakter düzeltme yardımcı fonksiyonu
function fixCharacterEncoding(text: string): string {
  return text
    // PDF2JSON'in yaygın karakter sorunlarını düzelt
    .replace(/\\|\//g, "i") // Slash ve backslash karakterlerini i olarak düzelt
    .replace(/\#/g, "i") // # karakterini i olarak düzelt
    .replace(/\(/g, "i") // ( karakterini i olarak düzelt
    .replace(/\+/g, "i") // ( karakterini i olarak düzelt
    .replace(/\>/g, "i") // > karakterini i olarak düzelt
    .replace(/([^a-zA-Z0-9üğşçöıÜĞŞÇÖİ,.:;\s\-_'"!?@#$%^&*()+=])/g, "") // Diğer garip karakterleri temizle
    .replace(/A([aeiıoöuü])/g, (match, vowel) => `İ${vowel}`) // A+vowel kombinasyonlarını İ+vowel yap
    .replace(/([^\s])A([^\s])/g, (match, before, after) => `${before}İ${after}`) // A karakterini İ olarak düzelt
    .replace(/\s{2,}/g, " ") // Birden fazla boşluğu tek boşluğa indirge
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Generate a unique filename
    const fileName = `${uuidv4()}.pdf`;
    // Use OS temp directory instead of /tmp
    const tempFilePath = path.join(os.tmpdir(), fileName);

    // Convert File to Buffer and save
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);

    // Parse PDF
    const pdfParser = new PDFParser();

    try {
      const parsedText = await new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData: any) => {
          console.error("PDF parsing error:", errData.parserError);
          reject(new Error("Failed to parse PDF"));
        });

        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
          try {
            // Extract text from each page
            const pages = pdfData.Pages || [];
            let text = "";

            for (let i = 0; i < pages.length; i++) {
              const page = pages[i];
              if (page.Texts) {
                for (let j = 0; j < page.Texts.length; j++) {
                  const textItem = page.Texts[j];
                  if (textItem.R && textItem.R.length > 0) {
                    text += textItem.R.map((r: any) => decodeURIComponent(r.T)).join(" ") + " ";
                  }
                }
                text += "\n\n"; // Add line breaks between pages
              }
            }

            // Karakter kodlama sorunlarını düzelt
            text = fixCharacterEncoding(text);

            resolve(text.trim());
          } catch (err) {
            console.error("Error processing PDF data:", err);
            reject(new Error("Failed to process PDF content"));
          }
        });

        pdfParser.loadPDF(tempFilePath);
      });

      // Clean up temp file
      await fs.unlink(tempFilePath).catch(console.error);

      if (!parsedText) {
        return NextResponse.json(
          { error: "No text could be extracted from the PDF" },
          { status: 400 }
        );
      }

      return NextResponse.json({ parsedText, fileName });
    } catch (parseError) {
      console.error("PDF parsing error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse PDF file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}