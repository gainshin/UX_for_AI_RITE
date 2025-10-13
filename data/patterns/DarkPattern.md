# 摘要：Dark Pattern 是在設計中有意誤導、操縱或限制使用者選擇，從而讓使用者做出非自願、對自己不利的操作——例如隱藏重要資訊、難以拒絕授權、預設勾選隱私濫用選項等。其本質是「損害使用者利益、提升平台/產品收益」的不透明設計。

## 1. Sneak into Basket（暗中加入購物車）
- **定義**：在結帳過程中，自動將額外商品、服務或費用加入購物車，未經明確同意。
- **AI 風險理由**：AI 可即時判斷使用者消費傾向，調整觸發門檻與捆綁內容，或在使用者被分類為 “ready_to_buy” 時自動觸發 Sneak-in Upsells，隱蔽性更高且難以察覺。
- **真實案例**：電子商務平台在結帳時自動捆綁保固或配件，僅以小字顯示「可取消」；或如 Booking.com 曾自動勾選「旅遊保險」，需手動移除。

## 2. Scarcity / Limited-time Message（稀缺／限時訊息）
- **定義**：顯示「庫存剩餘很少」或「優惠即將結束」訊息以施加壓力。
- **AI 風險理由**：AI 依 `hover_time` 動態放大剩餘庫存訊息（Fake Scarcity + View Inflation），增加稀缺感，使使用者快速決策。
- **真實案例**：Amazon 在商品頁面下方顯示「僅剩2件」，並每隔數秒刷新數量，誘導急購。

## 3. Confirmshaming（羞辱式確認）
- **定義**：以帶有責備或嘲諷語句，讓使用者在取消訂閱／拒絕時產生罪惡感。
- **AI 風險理由**：當使用者分類為 “hesitant”，AI 觸發帶有「No thanks, I prefer paying full price」的 Confirmshaming Modal，強化心理壓力。
- **真實案例**：The New York Times 推播新聞訂閱時，取消按鈕標示「No thanks, I hate great journalism」，造成強烈責備感。

## 4. Forced Enrollment（強制註冊）
- **定義**：必須先登入或提供個資才能使用功能。
- **AI 風險理由**：分類為 “at_risk” 時，AI 觸發 Forced Enrollment，要求以社群帳號登入才能「繼續瀏覽」，剝奪試用自由。
- **真實案例**：Medium 要求讀者先註冊才能繼續閱讀超過三篇文章，且預設繼續登入流程。

## 5. Hard to Cancel（退訂阻力／Roach Motel）
- **定義**：註冊或訂閱簡易，但取消或退出流程繁複多層。
- **AI 風險理由**：AI 可監測用戶嘗試退出的操作路徑（如滑鼠移動、點擊頻率），動態插入額外步驟或延遲取消流程；或配合 Wayfinders 的多層 CTA 模組，將「取消訂閱」按鈕隱藏於次級頁面，增大退出阻礙。
- **真實案例**：網路影音訂閱要求進入「帳戶設定」→「訂閱管理」→「客服電話」等多層選單，並在等待頁面再三推播續訂優惠，增加用戶的退出成本。

## 6. Social Proof / Activity Notifications（社會認同）
- **定義**：顯示「有人剛買了」或使用者評價動態，誘導跟隨群眾。
- **AI 風險理由**：當使用者游離無興趣（“uninterested”），AI 增加 Activity Notifications 頻率，並根據 hover 情況調高數值，誘發跟隨行為。
- **真實案例**：eBay 即時顯示「3 人同時在看此商品」、「剛有人出價」，促使競價。

## 7. Misdirection / Visual Interference（視覺誤導）
- **定義**：透過按鈕顏色、字體大小或畫面佈局，優先顯示想要的操作選項。
- **AI 風險理由**：Promot-actions 的 Auto-fill 設計與 Tuners 的 style filter 結合，AI 根據使用者點擊率調整按鈕顏色對比，將「同意」置於顯眼位置，「拒絕」灰化，混淆注意力。
- **真實案例**：Facebook 隱私設定頁面將 “Accept All Cookies” 按鈕以顯眼綠色呈現，而 “Manage Settings” 則小字灰底。

## 8. Bait and Switch（誘餌陷阱）
- **定義**：使用者以為要執行某項操作，結果卻觸發了完全不同的行為。[1]
- **AI 風險理由**：AI 可根據用戶點擊偏好，動態調整誘餌選項標籤與位置，讓用戶難以察覺實際後果。
- **真實案例**：Windows 10 升級對話框將「X」關閉按鈕變成「開始升級」，誤導使用者升級系統。[1]

## 9. Disguised Ads（偽裝廣告）
- **定義**：將廣告隱藏在正常內容或導航元素中，誤導用戶點擊。[1]
- **AI 風險理由**：AI 能自動分析哪些廣告最可能吸引用戶注意，再以相似排版與樣式嵌入頁面，難以分辨真偽。
- **真實案例**：字型下載網站 Dafont 將贊助下載按鈕標示與主「下載」按鈕極其相似，用戶易誤點廣告連結。[1]

## 10. Price Comparison Prevention（價格比較阻礙）
- **定義**：刻意隱藏各方案或同類產品的價格資訊，使用戶無法直觀看到完整選項，妨礙理性決策。[1]
- **AI 風險理由**：AI 可監測用戶在方案頁停留、滑動行為，自動移除或淡化「查看全部價格」按鈕，降低比較意願。
- **真實案例**：LinkedIn 隱藏 Premium 專業版各級方案價格，只提供試用入口，直到填表後才揭示完整費率。[1]

## 11. Pre-selection（預設勾選）
- **原理**：在使用者未察覺下，預先勾選同意框或選項，直接捆綁額外功能或訂閱。
- **AI 強化風險**：AI 可偵測使用者歷史偏好，自動決定最可能接受的附加服務並預選，令用戶不易發現也難以及時取消。
- **Hall of Shame 範例**：Figma 自動替所有用戶勾選「允許 AI 訓練使用設計檔案」。[hall]

## 12. Nagging（持續打擾）
- **原理**：反覆在多個頁面或多個時機點彈出相同邀請，消耗使用者耐心，最終迫使同意或下載。
- **AI 強化風險**：AI 透過行為監測判斷最佳介入時機與頻率，動態增加或調降彈出次數，使「打擾」更難抗拒。
- **Hall of Shame 範例**：Reddit 不斷在網頁各處推播「下載 App」訊息，不論使用者已多次拒絕。[hall]

## 13. Trick Question（誘餌問題）
- **原理**：將取消、拒絕或不同意選項用誤導性或雙重否定措辭包裝，讓使用者誤點完成相反動作。
- **AI 強化風險**：AI 可根據用戶的點擊行為，自動調整措辭與按鈕位置，增加誘導誤選的可能性。
- **Hall of Shame 範例**：Mainchimp 註冊中以「Uncheck this box if you do not want to receive newsletters」形式設計，誘使用戶誤留勾選。[hall]

## 14. Trick Wording（誘導性措辭）
- **定義**：利用模糊或誤導性文字，讓使用者在不自覺情況下做出不利選擇。
- **AI 風險理由**：AI 可根據用戶先前回應自動生成或調整措辭深度，動態優化誤導語句，提升誤點機率。
- **實例**：某線上訂閱服務以「取消即放棄所有優惠」標語，實際只會終止未來折扣，誘導續訂。

## 案例研究：Temu 的暗黑模式與過度遊戲化誘騙機制

### 1. Gamification Dark Patterns（遊戲化暗黑模式）
- **Spin-the-Wheel / Lucky Draw（幸運大轉盤）**：使用者可免費「抽獎」獲得折扣券或積分，看似娛樂性強，實則促使用戶留在頁面並重複點擊，提升購買意願。
- **Shake & Win（搖一搖抽獎）**：用戶透過搖手機才能觸發折扣，模仿街機遊戲機制，引發 Dopamine 迴路，強化留存與消費動機。
- **Flash Deals + Mini-games（限時快閃 + 小遊戲）**：Temu 定期推出限時「拼圖」、「翻牌」等互動小遊戲，以贏取優惠券，誘導用戶重複參與並最終下單。

### 2. Urgency & Scarcity（急迫感與稀缺性）
- **Countdown Timers（倒數計時）**：所有商品顯示「剩餘時間」、「即將截單」倒數，並隨用戶停留時間動態刷新，造成假象急迫，驅動衝動購買。
- **Almost Sold Out Tags（快賣完標籤）**：顯示「僅剩X件」，且數字會隨使用者滑動或滑鼠停留而迅速變動，AI 模式即時放大稀缺感。

### 3. Social Proof / Activity Notifications（社會認同）
- **Live Purchase Updates（即時購買動態）**：彈出「剛剛有人買了」訊息，並標示所在地，用戶感受到群體行為壓力，傾向跟進下單。
- **View Counters（觀看人數顯示）**：展示「目前有X人在看此商品」，隨用戶互動增加或減少，AI 動態調整數值，強化從眾效應。

### 4. Nagging & Push Notifications（持續打擾）
- **Excessive Pushes（過頻推播）**：Temu 每日多次發送「限時券即將過期」、「好友助力倒數」等通知，不論用戶關閉與否，透過增量設計持續干擾。
- **In-App Pop-ups（APP 內彈窗）**：不斷從頁面底部及中間彈出優惠推送，干擾瀏覽流程，使使用者最終疲勞而接受優惠。

### 5. Referral Traps（推薦陷阱）
- **Team Up & Get Cashback（組隊返現）**：誘導用戶發起「邀請好友組隊」，每人須助力才能解鎖更高返現，利用社交壓力擴大傳播與重複消費。

### 辨識要點
- 觀察是否有「遊戲化」互動元素（轉盤、搖抽、拼圖）強迫參與。
- 注意倒數計時與稀缺標籤是否隨用戶操作而動態變更。
- 檢查社會認同訊息（購買動態、觀看人數）是否為實時生成或 AI 虛擬增強數值。
- 評估推播與彈窗頻率，是否超過合理通知範圍，並難以完全關閉。
- 留意推薦返現機制，是否設計為必須他人助力才能獲得優惠的「陷阱」。



### 參考資料
[1]: https://uxdesign.cc/what-are-dark-patterns-86f7d1352366
[2]: https://uxdesign.cc/an-overview-of-the-dark-patterns-which-we-should-avoid-38526ec4db72
[3]: https://en.wikipedia.org/wiki/Dark_pattern
[4]: https://arxiv.org/html/2412.09147v1
[5]: https://uxplanet.org/dark-patterns-versus-behavioural-nudges-in-ux-e79633970b3f
[6]: https://www.uxtigers.com/post/dark-design
[7]: https://dspace.mit.edu/handle/1721.1/155501
[8]: https://www.nngroup.com/articles/deceptive-patterns/
[9]: https://hackernoon.com/navigating-user-responses-to-dark-patterns-in-ux-design
[hall]: https://www.hallofshame.design/

AI Pattern descriptions and classifications are partly adapted from [shapeof.ai](https://www.shapeof.ai/), which is sharable under the CC-BY-NC-SA license.

© Emily Campbell 2025 | Sharable under CC-BY-NC-SA | Contact