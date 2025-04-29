document.addEventListener('DOMContentLoaded', function () {
  const apiKey = '899fa072-efcb-4a2d-8e13-d276f0116416';
  const apiUrl = 'https://www.okx.com/api/v5/market/tickers?instType=SPOT';
  const loadingMessage = document.querySelector('.loading-message');

  function fetchData() {
    fetch(apiUrl, {
      headers: { 'X-API-KEY': apiKey },
      mode: 'cors'
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log("API Data:", data);  // تحقق من البيانات
        if (!data?.data) throw new Error("No data found");
        loadingMessage.textContent = "تم تحميل البيانات بنجاح!";
        // تابع معالجة البيانات...
      })
      .catch(error => {
        console.error("Error:", error);
        loadingMessage.textContent = `فشل التحميل: ${error.message}`;
      });
  }

  fetchData();
});
