
document.addEventListener('DOMContentLoaded', function() {
  const pageTitleElement = document.getElementById('page-title');
  const companyName = getCompanyNameFromURL();

  if (companyName) {
    pageTitleElement.textContent = `${companyName} News Reports`;

  }

  const csvRoot = document.getElementById('csv-root');
  fetch(`${companyName}.csv`)
    .then(response => response.text())
    .then(csvText => {
      const data = parseCSV(csvText);
      displayDataAsReports(data, csvRoot);
    })
    .catch(error => {
      console.error('Error loading CSV:', error);
      csvRoot.innerText = 'Failed to load data.';
    });
});

function parseCSV(csvText) {
  // Split the CSV text into lines
  const lines = csvText.trim().split('\n');
  return lines.map(line => {
    // Match fields that are not enclosed in quotes or that are enclosed in double quotes
    const regex = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g;
    let fields = [];
    let matches;
    while (matches = regex.exec(line)) {
      fields.push(matches[1] ? matches[1].replace(/\"\"/g, '\"') : matches[2]);
    }
    return fields;
  });
}

function displayDataAsReports(data, container) {
  data.slice(1).forEach(row => {
    if (row.length < 7) return; // Ensure row has enough columns

    const reportCard = document.createElement('div');
    reportCard.className = 'report-card';

    const title = document.createElement('div');
    title.className = 'report-title';
    const sentimentClass = `sentiment-tag sentiment-${row[4].toLowerCase()}`;
    title.innerHTML = `<span class="${sentimentClass}">${row[4]}</span>${row[0]}`;
    reportCard.appendChild(title);

    // Create and append the date
    const dateElement = document.createElement('div');
    dateElement.className = 'report-date';
    dateElement.textContent = row[6];
    reportCard.appendChild(dateElement);

    const link = document.createElement('a');
    link.className = 'report-link';
    link.setAttribute('href', row[1]);
    link.textContent = 'Read More';
    reportCard.appendChild(link);

    const magazine = document.createElement('div');
    magazine.textContent = `Source: ${row[2]}`;
    reportCard.appendChild(magazine);

    const summary = document.createElement('div');
    summary.className = 'report-summary';
    summary.textContent = row[3];
    summary.style.display = 'none'; // Initially hidden

    reportCard.appendChild(summary);

    const analysis = document.createElement('div');
    analysis.className = 'report-analysis';
    analysis.textContent = row[5];
    analysis.style.display = 'none'; // Initially hidden

    reportCard.appendChild(analysis);

    const summaryToggle = createToggle(summary, 'Summary');
    const analysisToggle = createToggle(analysis, 'Analysis');

    reportCard.appendChild(summaryToggle);
    reportCard.appendChild(analysisToggle);

    container.appendChild(reportCard);
  });
}

function createToggle(section, label) {
  const toggle = document.createElement('button');
  toggle.textContent = `Show ${label}`;
  toggle.onclick = function() {
    const isHidden = section.style.display === 'none';
    section.style.display = isHidden ? 'block' : 'none';
    toggle.textContent = isHidden ? `Hide ${label}` : `Show ${label}`;
  };
  return toggle;
}

function getCompanyNameFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('company');
}