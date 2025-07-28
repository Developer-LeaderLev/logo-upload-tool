document.addEventListener('DOMContentLoaded', () => {
  const supabase = Supabase.createClient(
    "https://anigfhqllnhrxhbturvs.supabase.co",
    "your-anon-key"
  );

  // expose uploadFile globally for button onclick
  window.uploadFile = async function() {
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
  };
});
