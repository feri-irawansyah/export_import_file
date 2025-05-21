<script>
    export let result
</script>

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