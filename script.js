document.addEventListener('DOMContentLoaded', function() {
  const apiKey = '899fa072-efcb-4a2d-8e13-d276f0116416';
  const proxyUrl = 'https://your-proxy.workers.dev/'; // استبدلها برابط البروكسي الخاص بك
  const apiPath = 'api/v5/market/tickers?instType=SPOT';
  
  const loadingMessage = document.querySelector('.loading-message');
  
  async function fetchData() {
    try {
      loadingMessage.textContent = "جارٍ جلب البيانات...";
      
      const response = await fetch(proxyUrl + apiPath, {
        headers: { 'X-API-KEY': apiKey }
      });
      
      const data = await response.json();
      if (!data.data) throw new Error("No data received");
      
      // عرض البيانات هنا
      console.log("البيانات:", data.data);
      loadingMessage.style.display = 'none';
      
    } catch (error) {
      console.error("Error:", error);
      loadingMessage.innerHTML = `
        فشل التحميل: ${error.message}
        <button onclick="fetchData()">إعادة المحاولة</button>
      `;
    }
  }
  
  fetchData();
});
