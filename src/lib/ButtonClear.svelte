<script>
    import Swal from "sweetalert2";

    let { resetProgress, getData } = $props();
</script>

<button
  class="btn btn-outline-danger btn-sm"
  onclick={async () => {
    
    resetProgress()
    await fetch("http://localhost:8000/api/v1/data/clear", {
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
            getData();
          },
        });
      }
    });
  }}><i class="bi bi-trash"></i> Hapus</button
>
