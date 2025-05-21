<script>
  import Swal from "sweetalert2";

    const { result_progress } = $props();
</script>

<div class="col-lg-6 progress-bar">
    <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow={result_progress.progress} aria-valuemin="0" aria-valuemax={result_progress.count}>
    <div class="progress-bar" style="width: {result_progress.count > 0 ? (result_progress.progress / result_progress.count) * 100 : 0}%"></div>
    </div>
    <div class="d-flex">
        <strong class="me-2">Progress Import:</strong>
        {#if result_progress.isProgress || result_progress.done}
        <span>{result_progress.progress} dari {result_progress.count}</span>
        {:else if result_progress.error && !result_progress.done}
        <span class="text-danger">{result_progress.message} <button onclick={() => {
        Swal.fire({
            title: 'Error',
            text: result_progress.error,
            icon: 'error',
            confirmButtonText: 'OK'
        })
        }} class="btn btn-progress" aria-label="Basic example"><i class="bi bi-info-circle bg-warning rounded-circle"></i></button></span>
        {:else}
        <span>Belum ada aktifitas</span>
        {/if}
    </div>
</div>

<style>
    .btn-progress{
        padding: 0;
        border: 0;
    }
</style>