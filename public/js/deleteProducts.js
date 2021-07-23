async function deleteProduct(ProductID) {
  const response = await axios.delete(`/admin/editDeleteProducts/${ProductID}`);
  return response;
}

const deleteButtons = document.querySelectorAll(".delete");

deleteButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    const value = e.target.dataset.id;

    if (!value) return;
    // Alert and press OK to confirm deletion
    const confirmDelete = confirm("Press OK to confirm deletion");
    if (confirmDelete) {
      const response = await deleteProduct(value);

      // Reloads the page
      if (response.statusText === "OK") {
        location.reload();
      }
    }
  });
});
