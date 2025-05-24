<script>
  // @ts-ignore
  import jQuery from 'jquery';
  // @ts-ignore
  window.$ = window.jQuery = jQuery;
  import { onMount } from "svelte";
  // @ts-ignore
  import Swal from "sweetalert2";
  import ModalContainer from "./lib/ModalContainer.svelte";
  import ModalImport from "./lib/ModalImport.svelte";
  import { base_url, openModal, socket_url } from "./app";
  // @ts-ignore
  import ButtonClear from "./lib/ButtonClear.svelte";
  import ResultProgress from "./lib/ResultProgress.svelte";
  import TableData from "./lib/TableData.svelte";

  // @ts-ignore
  let connection = $state('');
  let conn_class = $state('');

  let ws = $state(null);

  let result_progress = $state({
    isProgress: false,
    done: false,
    count: 0,
    progress: 0,
    message: "", 
    error: ""
  });

  let filetype = $state("");

  function connectWs() {
    ws = new WebSocket(`${socket_url}/generic/ws/`);
    attachWsHandlers(ws);
  }

  function attachWsHandlers(ws) {
    ws.onopen = () => {
      console.log("Connected");
      connection = "Connected";
      conn_class = "success";
    };

    ws.onclose = () => {
      console.log("Disconnected, reconnecting...");
      connection = "Disconnected, reconnecting...";
      conn_class = "warning";
      setTimeout(() => {
        connectWs();
      }, 5000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      connection = "Error";
      conn_class = "danger";
      ws.close();
    };

    ws.onmessage = (/** @type {{ data: any; }} */ event) => {
      const msg = JSON.parse(event.data);
      
      if (msg.event === "import_progress") {
        result_progress.isProgress = true;
        result_progress.progress = msg.data.current;
        result_progress.count = msg.data.total;
        result_progress.message = `Importing ${msg.data.row} (${result_progress.progress} of ${result_progress.count})`;
      }

      if (msg.event === "import_done") {
        result_progress.isProgress = false;
        result_progress.message = msg.data.message;
        result_progress.done = true;
        globalThis.$("#myTable").bootstrapTable("refresh");
      }
      if (msg.event === "import_error") {
        result_progress.isProgress = false;
        result_progress.message = msg.data.message;
        result_progress.error = msg.data.error;
        result_progress.done = false;
      }
    };
  }

  onMount(() => {
    connectWs();
  });

  function resetProgress() {
    result_progress = {
      isProgress: false,
      done: false,
      count: 0,
      progress: 0,
      message: "",
      error: "",
    };
  }

  async function DownloadFile(filetype) {
    let contentType = "";

    if(filetype == "" || filetype == undefined) {
      Swal.fire({
        title: "Error",
        text: "Pilih file terlebih dahulu",
        icon: "error",
        backdrop: false,
        confirmButtonText: "OK",
      })
    } else if(filetype == "csv") {
      contentType = "text/csv";
    } else if(filetype == "txt") {
      contentType = "text/plain";
    } else if(filetype == "xlsx") {
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if(filetype == "pdf") {
      contentType = "application/pdf";
    } else if(filetype == "xml") {
      contentType = "application/xml";
    }

    await fetch(`${base_url}/export/${filetype}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": contentType,
      },
    }).then((res) => {
      if (res.status == 200) {
        window.location.href = `${base_url}/export/${filetype}`;
      } 

      if (res.status == 404) {
        Swal.fire({
          title: "Error",
          text: "File tidak ditemukan",
          icon: "error",
          backdrop: false,
          confirmButtonText: "OK",
        })
      }
    }).catch((err) => {
      Swal.fire({
        title: "Error",
        text: err,
        icon: "error",
        backdrop: false,
        confirmButtonText: "OK",
      })
    });
  }

  async function downloadTemplate(fileName) {
    const response = await fetch(`/templates/${fileName}`);
    if (!response.ok) {
      console.error("Download gagal:", response.statusText);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  }

</script>
<p class="bg-{conn_class} connection-status">{connection}</p>
<section class="container">
  <div class="card">
    <div class="row">
      <div class="col-lg-6">
        <span class="fs-3 fw-bold">Snakesystem Import Export File</span>
        <ResultProgress result_progress={result_progress}/>
      </div>
    </div>
    
    <div class="d-flex toolbar">
      <div class="dropdown">
        <button class="btn dropdown-button dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Import <span>Group</span>
          </button>
          <ul class="dropdown-menu">
            <li>
              <button class="btn btn-outline-success" aria-label="Basic example" onclick={() => {
                filetype = "csv",
                openModal("import-modal")
              }}><i class="bi bi-filetype-csv"></i> .csv</button>
              <button class="btn btn-outline-success" aria-label="Basic example" onclick={() => {
                filetype = "txt",
                openModal("import-modal")
              }}><i class="bi bi-filetype-txt"></i> .txt</button>
              <button class="btn btn-outline-success" aria-label="Basic example" onclick={() => {
                filetype = "xlsx",
                openModal("import-modal")
              }}><i class="bi bi-filetype-xlsx"></i> .xlsx</button>
              <button class="btn btn-outline-success" aria-label="Basic example" onclick={() => {
                filetype = "dbf",
                openModal("import-modal")
              }}><i class="bi bi-database"></i> .dbf</button>
              <button class="btn btn-outline-success" aria-label="Basic example" onclick={() => {
                filetype = "xml",
                openModal("import-modal")
              }}><i class="bi bi-filetype-xml"></i> .xml</button>
            </li>
          </ul>
      </div>
      <div class="dropdown">
        <button class="btn dropdown-button dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Export <span>Group</span>
        </button>
        <ul class="dropdown-menu">
          <li>
            <button class="btn btn-outline-success" aria-label="Basic example" onclick={() => DownloadFile("csv")}><i class="bi bi-download"></i> .csv</button>
            <button class="btn btn-outline-success" aria-label="Basic example" onclick={() => DownloadFile("txt")}><i class="bi bi-download"></i> .txt</button>
            <button class="btn btn-outline-success" aria-label="Basic example" onclick={() => DownloadFile("xlsx")}><i class="bi bi-download"></i> .xlsx</button>
            <button class="btn btn-outline-success" aria-label="Basic example" onclick={() => DownloadFile("pdf")}><i class="bi bi-download"></i> .pdf</button>
            <button class="btn btn-outline-success" aria-label="Basic example" onclick={() => DownloadFile("xml")}><i class="bi bi-download"></i> .xml</button>
          </li>
        </ul>
      </div>
      <div class="template-button">
        <button class="btn" onclick={() => downloadTemplate("tempimport.dbf")}><i class="bi bi-download"></i> <span>Template</span> DBF</button>
        <button class="btn" onclick={() => downloadTemplate("big_data.xlsx")}><i class="bi bi-download"></i> <span>1000</span> Data</button>
      </div>
     <!-- Disini bisa di isi apa gitu -->
    </div>
    <TableData resetProgress={resetProgress}/>
  </div>
  <ModalContainer id="import-modal" title="Import File {filetype?.toUpperCase()}" size="md" >
    <ModalImport filetype={filetype}/>
  </ModalContainer>
</section>

<style>
  .container {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
  }

  .card {
    width: 100%;
    height: 80%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    border: none;
  }

  .connection-status {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    padding: 10px;
    color: #fff;
    font-weight: bold;
    z-index: 9999;
  }

</style>