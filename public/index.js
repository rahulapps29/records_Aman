document.addEventListener("DOMContentLoaded", async () => {
  // Get the current name from the URL (like /rovin or /tiya)
  const pathSegments = window.location.pathname.split("/");
  const name = pathSegments.length > 1 ? pathSegments[1] : "";

  // Fetch transaction data, using the name parameter if present
  const response = await fetch(`/api/data/${name}`);
  let transactionsData = await response.json();

  let transactions = transactionsData.tasks;
  let transactionCount = transactionsData.taskCount;

  let totalAmt = 0;
  transactions.forEach((card) => {
    totalAmt += card.Amt;
  });
  console.log(totalAmt);

  // Update grand total
  function grandtotal() {
    document.getElementById(
      "grandtotal"
    ).innerHTML = `${name} : Closing Bal: ${totalAmt} : Tran count: ${transactionCount} `;
  }
  grandtotal();

  // Sort transactions by date (ascending)
  transactions.sort(
    (a, b) => new Date(a.TransactionDate) - new Date(b.TransactionDate)
  );

  // Populate table rows in batches
  const transactionTable = document.getElementById("transactionTable");
  let runningTotal = 0;
  const batchSize = 20; // Number of rows per batch
  const delay = 50; // Delay between batches in milliseconds

  function populateBatch(startIndex) {
    const fragment = document.createDocumentFragment();
    for (
      let i = startIndex;
      i < startIndex + batchSize && i < transactions.length;
      i++
    ) {
      const transaction = transactions[i];
      runningTotal += transaction.Amt;

      // Determine 'gave' and 'got' fields
      const gave = transaction.DebitCredit === "gave" ? transaction.Amt : "";
      const got = transaction.DebitCredit === "got" ? transaction.Amt : "";

      // Create table row
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(transaction.TransactionDate).toLocaleString()}</td>
        <td>${transaction.TransactionDescription}</td>
        <td>${gave}</td>
        <td>${got}</td>
        <td>${runningTotal}</td>
      `;
      fragment.appendChild(row);
    }
    transactionTable.appendChild(fragment);

    // Schedule the next batch if there are more rows
    if (startIndex + batchSize < transactions.length) {
      setTimeout(() => populateBatch(startIndex + batchSize), delay);
    }
  }

  // Start populating the table
  populateBatch(0);
});

const toggleButton = document.getElementById("mode-toggle");
const body = document.body;

// Set dark mode as default
body.classList.add("dark-mode");

// Update button text on load
toggleButton.textContent = "Light";

toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  toggleButton.textContent = body.classList.contains("dark-mode")
    ? "Light"
    : "Dark";
});
