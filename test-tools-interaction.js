import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 監聽 console 訊息
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:8000/tools.html');
  await page.waitForLoadState('networkidle');
  
  console.log('=== 頁面載入完成 ===');
  
  // 檢查左側篩選列表
  const filterItems = await page.locator('.tool-filter-item').count();
  console.log(`篩選項目數量: ${filterItems}`);
  
  // 獲取第一個和第二個篩選項目的文本
  if (filterItems > 0) {
    const firstFilterText = await page.locator('.tool-filter-item').nth(0).textContent();
    console.log(`第一個篩選項目: ${firstFilterText}`);
  }
  
  if (filterItems > 1) {
    const secondFilterText = await page.locator('.tool-filter-item').nth(1).textContent();
    console.log(`第二個篩選項目: ${secondFilterText}`);
  }
  
  // 檢查初始工具數量
  const initialToolCount = await page.locator('.tool-card').count();
  console.log(`初始工具卡片數量: ${initialToolCount}`);
  
  // 點擊第二個篩選項目
  if (filterItems > 1) {
    console.log('\n=== 點擊第二個篩選項目 ===');
    await page.locator('.tool-filter-item').nth(1).click();
    await page.waitForTimeout(500);
    
    // 檢查點擊後的工具數量
    const afterClickToolCount = await page.locator('.tool-card').count();
    console.log(`點擊後工具卡片數量: ${afterClickToolCount}`);
    
    // 檢查是否有 selected class
    const hasSelected = await page.locator('.tool-filter-item.selected').count();
    console.log(`有 selected class 的項目數量: ${hasSelected}`);
  }
  
  await browser.close();
})();
