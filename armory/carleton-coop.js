// Finds the gridbox by ID and downloads applications as a CSV file
// Paste this into your browser's DevTools console on the applications page

(function () {
  const gridBox = document.getElementById('na_studentApplicationGrid_gridBox');
  if (!gridBox) {
    alert('Grid box not found! Make sure you are on the applications page.');
    return;
  }

  const table = gridBox.querySelector('table');
  if (!table) {
    alert('Table not found inside the grid box!');
    return;
  }

  const rows = table.querySelectorAll('tbody tr');
  const csvRows = ['Company Name,Position Title,Location'];

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td[role="gridcell"]');
    if (cells.length < 14) return; // skip malformed rows

    // Column indices (0-based, within gridcell tds):
    //  0 = action buttons
    //  1 = Term
    //  2 = Job ID
    //  3 = Job Title       → Position Title
    //  4 = Organization    → Company Name
    //  5 = Division
    //  6 = Application Package
    //  7 = Application Status
    //  8 = Application Deadline
    //  9 = Application Submitted On
    // 10 = Application Submitted By
    // 11 = Openings
    // 12 = Long Term Placement
    // 13 = Location        → Location
    // 14 = City

    const companyName = cells[4].textContent.trim();
    const positionTitle = cells[3].textContent.trim();
    const location = cells[13].textContent.trim();

    // Escape fields that might contain commas or quotes
    const escape = (field) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    csvRows.push(
      `${escape(companyName)},${escape(positionTitle)},${escape(location)}`
    );
  });

  // Create and trigger download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'applications.csv';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log(`Downloaded ${rows.length} applications as CSV.`);
})();
