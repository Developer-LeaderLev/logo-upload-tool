const supabase = Supabase.createClient(
  "https://anigfhqllnhrxhbturvs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuaWdmaHFsbG5ocnhoYnR1cnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Njc0MTMsImV4cCI6MjA2NDU0MzQxM30.ipHycEKyFq0LycGmEUuQGowSaaY1KUUJVIPDfpKjhXc"
);

async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const resultDiv = document.getElementById("result");

  if (!fileInput.files || fileInput.files.length === 0) {
    resultDiv.textContent = "⚠️ Please choose a file to upload.";
    return;
  }

  const file = fileInput.files[0];
  const filePath = `uploads/${Date.now()}_${file.name}`;

  resultDiv.textContent = "Uploading...";

  const { data, error } = await supabase.storage
    .from("image-upload")
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error("Upload error:", error);
    resultDiv.textContent = `❌ Upload failed: ${error.message}`;
    return;
  }

  const { data: publicData } = supabase
    .storage
    .from("image-upload")
    .getPublicUrl(filePath);

  resultDiv.innerHTML = `
    ✅ Upload successful!<br/>
    🌐 Public URL:<br/>
    <code>${publicData.publicUrl}</code>
  `;
}
