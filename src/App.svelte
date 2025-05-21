<script>
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import ModalContainer from "./lib/ModalContainer.svelte";
  import ModalImport from "./lib/ModalImport.svelte";
  import { openModal } from "./app";
  import ButtonClear from "./lib/ButtonClear.svelte";
  import ResultProgress from "./lib/ResultProgress.svelte";
  import TableData from "./lib/TableData.svelte";
  let result = $state({
    total: true,
    rows: []
  })

  let result_progress = $state({
    isProgress: false,
    done: false,
    count: 0,
    progress: 0,
    message: "", 
    error: ""
  });

  let filetype = $state("");

  onMount(() => {
    const ws = new WebSocket("ws://localhost:8000/api/v1/generic/ws/");

    ws.onmessage = (event) => {
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
            getData();
        }
        if (msg.event === "import_error") {
            result_progress.isProgress = false;
            result_progress.message = msg.data.message;
            result_progress.error = msg.data.error;
            result_progress.done = false;
        }
    };

    getData();
  });

  async function getData() {
    try {
      await fetch('http://localhost:8000/api/v1/data/get-table?tablename=TempImport&offset=0&limit=10&nidkey=TempImportNID', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.status == 200) {
          return res.json()
        }
      }).then((data) => {
        result = data
      })
    } catch (error) {
      
    }
  }

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

</script>
<section class="container">
  <div class="card">
    <div class="toolbar flex-row">
      <div class="p-3 row">
        <div class="col-lg-6 d-flex gap-4">
          <ButtonClear resetProgress={resetProgress} getData={getData}/>
          <span class="fs-3 fw-bold">Snakesystem Import Export File</span>
        </div>
        <ResultProgress result_progress={result_progress}/>
      </div>
      <div class="button-container row p-3">
        <div class="col-lg-6 text-center">
          <h5 class="mb-3">Import Data</h5>
          <button class="btn btn-success" aria-label="Basic example" onclick={() => {
            filetype = "csv",
            openModal("import-modal")
          }}><i class="bi bi-filetype-csv"></i> .csv</button>
          <button class="btn btn-info" aria-label="Basic example" onclick={() => {
            filetype = "txt",
            openModal("import-modal")
          }}><i class="bi bi-filetype-txt"></i> .txt</button>
          <button class="btn btn-danger" aria-label="Basic example" onclick={() => {
            filetype = "xlsx",
            openModal("import-modal")
          }}><i class="bi bi-filetype-xlsx"></i> .xlsx</button>
          <button class="btn btn-primary" aria-label="Basic example"><i class="bi bi-database"></i> .dbf</button>
          <button class="btn btn-warning" aria-label="Basic example"><i class="bi bi-filetype-xml"></i> .xml</button>
        </div>
        <div class="col-lg-6 text-center">
          <h5>Export Data</h5>
          <button class="btn btn-success" aria-label="Basic example"><i class="bi bi-download"></i> .csv</button>
          <button class="btn btn-info" aria-label="Basic example"><i class="bi bi-download"></i> .txt</button>
          <button class="btn btn-danger" aria-label="Basic example"><i class="bi bi-download"></i> .xlsx</button>
          <button class="btn btn-primary" aria-label="Basic example"><i class="bi bi-download"></i> .dbf</button>
          <button class="btn btn-warning" aria-label="Basic example"><i class="bi bi-download"></i> .xml</button>
        </div>
      </div>
    </div>
    <TableData result={result}/>
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
  }

  .card {
    width: 100%;
    height: 80%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
  }

  .button-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }

</style>