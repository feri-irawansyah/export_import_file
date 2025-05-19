<script>
// @ts-nocheck
  import { closeModal } from "../app";

  let result = "";
    let file = null;

    async function importBeneran() {
        if (!file) {
            // alert("Pilih file dulu, bro.");
            result = "Pilih file dulu, bro.";
            return;
        }
        
        const formData = new FormData();
        formData.append("file", file);
        
        try {
            const res = await fetch("http://localhost:8000/api/v1/import/csv", {
                method: "POST",
                body: formData
            });
            
            const data = await res.json();
            console.log("Response:", data);
            // alert(data.message || "Upload selesai.");
            result = data.message || "Upload selesai.";
        } catch (err) {
            console.error("Upload error:", err);
            // alert("Gagal upload file.");
            result = "Gagal upload file.";
        }
    }

    export let filetype = "";
</script>

<form onsubmit={(e) => {
    e.preventDefault();
    importBeneran();
    closeModal("import-modal");

}}>
    <input type="file" onchange="{(e) => file = e.target.files[0]}" accept=".{filetype}" />
    <button type="submit">Import</button>
</form>