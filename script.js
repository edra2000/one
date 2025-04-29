document.addEventListener('DOMContentLoaded', function() {
  // 1. استخدم خدمة وسيطة لتجاوز CORS
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = 'https://www.okx.com/api/v5/market/tickers?instType=SPOT';
  
  // 2. عناصر واجهة المستخدم
  const gridContainer = document.querySelector('.crypto-grid');
  const loadingMessage = document.querySelector('.loading-message');
  
  // 3. دالة جلب البيانات
  async function fetchData() {
    try {
      loadingMessage.textContent = "جارٍ تحميل البيانات...";
      
      const response = await fetch(proxyUrl + apiUrl, {
        headers: {
          'X-API-KEY': '899fa072-efcb-4a2d-8e13-d276f0116416',
          'Origin': 'http://localhost' // مطلوب لبعض خدمات الـ Proxy
        }
      });
      
      if (!response.ok) throw new Error(`خطأ HTTP: ${response.status}`);
      
      const data = await response.json();
      console.log("البيانات المستلمة:", data); // للتصحيح
      
      if (!data.data) throw new Error("لا توجد بيانات متاحة");
      
      // 4. معالجة البيانات الناجحة
      loadingMessage.style.display = 'none';
      processData(data.data);
      
    } catch (error) {
      console.error("فشل جلب البيانات:", error);
      loadingMessage.innerHTML = `
        فشل التحميل: ${error.message}
        <button onclick="fetchData()">إعادة المحاولة</button>
      `;
    }
  }

  // 5. تشغيل أولي
  fetchData();
});
