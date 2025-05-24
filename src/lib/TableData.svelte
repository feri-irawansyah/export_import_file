<script>
    import { onMount } from "svelte";
    import { base_url, fetchColumns, openModal, tableFormatter } from "../app";
    import Swal from "sweetalert2";

    const { resetProgress } = $props();

    let tablename = "TempImport";
    let tablePK = "TempImportNID";

    let result = {
      total: true,
      data: []
    };

    function toolbarButton () {
        return {
        btnFilter: {
            text: "Clear Data",
            icon: "bi bi-trash",
            event: async function () {
                resetProgress()
                await fetch(`${base_url}/data/clear`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                }).then((res) => {
                if (res.status == 200) {
                    Swal.fire({
                        title: "Success",
                        text: "Data berhasil dihapus",
                        icon: "success",
                        backdrop: false,
                        confirmButtonText: "OK",
                        preConfirm: () => {
                            globalThis.$("#myTable").bootstrapTable("refresh");
                        },
                    });
                }
                });
            },
            attributes: {
                title: "Search all data",
            }
        }
        }
    }

    /**
   * @param {any[]} columns
   */
    function initTable(columns) {
        // Destroy table first if already exists
        // @ts-ignore
        globalThis.$("#myTable").bootstrapTable("destroy");

        // Initialize new table
        // @ts-ignore
        globalThis.$("#myTable").bootstrapTable({
        url: `${base_url}/data/get-table?tablename=${tablename}&nidkey=${tablePK}`,
        method: "GET",
        buttons: toolbarButton(),
        contentType: "application/json",
        buttonsClass: "none",
        dataType: "json",
        buttonsAlign: "left",
        toolbarAlign: "right",
        cache: false,
        sidePagination: "server",
        showColumns: true, 
        pagination: true,
        showRefresh: true,
        autoRefresh: false,
        autoRefreshInterval: 120,
        toolbar: ".toolbar",
        offset: 0,
        pageSize: 10,
        pageList: [10, 100, 200, 500, 1000],
        height: 600,
        columns: tableFormatter(columns),
        });
    }

    const dumy_columns = [
		{
			"field": "TempImportNID",
			"filterControl": "input",
			"sortable": true,
			"title": "Temp Import NID"
		},
		{
			"field": "Email",
			"filterControl": "input",
			"sortable": true,
			"title": "Email"
		},
		{
			"field": "FullName",
			"filterControl": "input",
			"sortable": true,
			"title": "Full Name"
		},
		{
			"field": "Age",
			"filterControl": "input",
			"sortable": true,
			"title": "Age"
		},
		{
			"field": "Sex",
			"filterControl": "input",
			"sortable": true,
			"title": "Sex"
		},
		{
			"field": "Contact",
			"filterControl": "input",
			"sortable": true,
			"title": "Contact"
		},
		{
			"field": "ProductName",
			"filterControl": "input",
			"sortable": true,
			"title": "Product Name"
		},
		{
			"field": "ProductCount",
			"filterControl": "input",
			"sortable": true,
			"title": "Product Count"
		},
		{
			"align": "right",
			"field": "Price",
			"filterControl": "input",
			"sortable": true,
			"title": "Price"
		},
		{
			"field": "IPAddress",
			"filterControl": "input",
			"sortable": true,
			"title": "IPAddress"
		},
		{
			"field": "LastUpdate",
			"filterControl": "date",
			"formatter": "dateFormatter",
			"sortable": true,
			"title": "Last Update"
		}
	]

    onMount(async () => {
        result = await fetchColumns(tablename);
        if (result.result && result.data && Array.isArray(result.data)) {
            initTable(result.data);
        } else {
            initTable(dumy_columns);
            console.error("Data columns not valid", result);
        }
    });

</script>

<table id="myTable" class="table table-striped" data-toggle="table"></table>

<style>
    
</style>