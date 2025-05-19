<script>
  import { onMount } from "svelte";
  import ModalContainer from "./lib/ModalContainer.svelte";
  import ModalImport from "./lib/ModalImport.svelte";
  import { openModal } from "./app";
  let result = $state({
    total: true,
    rows: []
  })

  let progress = $state(0);
  let total = $state(0);
  let message = "";
  let done = false;

  let filetype = $state("");

  onMount(() => {
    const ws = new WebSocket("ws://localhost:8000/api/v1/generic/ws/");

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.event === "import_progress") {
            progress = msg.data.current;
            total = msg.data.total;
            message = `Importing ${msg.data.row} (${progress} of ${total})`;
        }

        if (msg.event === "import_done") {
            message = msg.data.message;
            done = true;
            getData();
        }
        if (msg.event === "import_error") {
            message = msg.data.message;
            done = true;
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

</script>
<section class="container">
  <div class="card">
    <div class="toolbar flex-row">
      <div class="p-3 row">
        <div class="col-lg-6 d-flex gap-4">
          <button class="btn btn-outline-danger btn-sm" onclick={async () => {
            await fetch('http://localhost:8000/api/v1/data/clear', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            }).then((res) => {
              if (res.status == 200) {
                getData()
              }
            })
          }}><i class="bi bi-trash"></i> Hapus</button>
          <span class="fs-3 fw-bold">Snakesystem Import Export File</span>
        </div>
        <div class="col-lg-6 progress-bar">
          <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow={progress} aria-valuemin="0" aria-valuemax={total}>
            <div class="progress-bar" style="width: {total > 0 ? (progress / total) * 100 : 0}%"></div>
          </div>
          <span>Data progress {progress} dari {total}</span>
        </div>
      </div>
      <div class="button-container row p-3">
        <div class="col-lg-6 text-center">
          <h5 class="mb-3">Import Data</h5>
          <button class="btn btn-success" aria-label="Basic example" onclick={() => {
            filetype = "csv",
            openModal("import-modal")
          }}><i class="bi bi-filetype-csv"></i> .csv</button>
          <button class="btn btn-info" aria-label="Basic example"><i class="bi bi-filetype-txt"></i> .txt</button>
          <button class="btn btn-danger" aria-label="Basic example"><i class="bi bi-filetype-xlsx"></i> .xlsx</button>
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
    <table class="table table-striped table-hover table-bordered">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Email</th>
          <th scope="col">Full name</th>
          <th scope="col">Age</th>
          <th scope="col">Sex</th>
          <th scope="col">Contact</th>
          <th scope="col">ProductName</th>
          <th scope="col">Price</th>
          <th scope="col">IPAddress</th>
          <th scope="col">LastUpdate</th>
        </tr>
      </thead>
      <tbody class="bg-danger">
        {#each result.rows as row}
          <tr>
            <td>{row.TempImportNID}</td>
            <td>{row.Email}</td>
            <td>{row.FullName}</td>
            <td>{row.Age}</td>
            <td>{row.Sex}</td>
            <td>{row.Contact}</td>
            <td>{row.ProductName}</td>
            <td>{row.Price}</td>
            <td>{row.IPAddress}</td>
            <td>{row.LastUpdate}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <ModalContainer id="import-modal" title="Import Data" size="lg" >
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