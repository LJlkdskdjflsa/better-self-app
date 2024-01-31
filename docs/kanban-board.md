# Kanban board

## Hooks

- useApplicantDragAndDrop
- useApplicantCollection
- useColumnApplicants
- useColumnDrop

### useApplicantDragAndDrop

這個 useApplicantDragAndDrop 函數是一個自定義的 React Hook，主要用於處理任務的拖放操作。
在這段程式碼中，我們可以看到以下的主要邏輯：

- 計算滑鼠的位置相對於被拖動項目的中點的位置。這是為了確定滑鼠是否已經過了被拖動項目的一半。
- 如果滑鼠在被拖動項目的上半部，並且被拖動項目在被懸停項目的上方，則不進行任何操作。
- 如果滑鼠在被拖動項目的下半部，並且被拖動項目在被懸停項目的下方，則不進行任何操作。
- 如果滑鼠已經過了被拖動項目的一半，則調用 handleDropHover 函數，並傳入被拖動項目和被懸停項目的索引。這個函數的具體實現可能會改變任務的順序。

最後，這個 Hook 返回一個包含 ref 和 isDragging 的物件。ref 是一個可以被附加到 DOM 元素上的參考，isDragging 是一個布林值，表示是否正在拖動任務。

### useTaskCollection

這個 useApplicantCollection 函數是一個自定義的 Hook，它使用了 useLocalStorage 這個 Hook 來管理存儲在本地存儲中的任務數據。

這個函數返回一個包含不同類型的任務列表的對象。這個對象的鍵是列的類型（例如 "Todo"，"In Progress"，"Blocked"），值是該類型的任務列表。

在初始化時，每種類型的列都有一個任務。每個任務都有一個唯一的 ID（使用 uuidv4 函數生成），一個列類型，一個標題，和一個顏色。

這個 Hook 的主要用途是為了在本地存儲中保存和讀取任務數據，並且提供一個方便的方式來獲取和操作這些數據。

### useColumnApplicants

這個 useColumnApplicants 函數是一個自定義的 React Hook，它用於管理特定列中的任務。

在這段程式碼中，我們可以看到以下的主要邏輯：

使用 useApplicantCollection Hook 從本地存儲中獲取所有的任務並設置更新函數。
定義一個 addEmptyTask 函數，這個函數使用 useCallback Hook 來確保它的引用在每次渲染時都不會改變。這個函數的功能是在特定的列中添加一個新的空任務。
在 addEmptyTask 函數中，首先檢查特定列中的任務數量是否已經達到最大值。如果已經達到最大值，則不進行任何操作並返回當前的所有任務。
如果特定列中的任務數量還沒有達到最大值，則創建一個新的任務並將其添加到該列中。新的任務包含一個唯一的 ID（使用 uuidv4 函數生成），一個標題，一個顏色，和一個列類型。

這個 Hook 的主要目的是為了在特定的列中添加新的任務，並且確保每個列中的任務數量不會超過最大值。

### useColumnDrop

這個 useColumnDrop 函數是一個自定義的 React Hook，它使用了 react-dnd 的 useDrop Hook 來處理拖放事件。

在這段程式碼中，我們可以看到以下的主要邏輯：

- useDrop Hook 接受一個對象作為參數，這個對象包含了三個屬性：accept，drop，和 collect。
- accept 屬性是一個表示可以接受哪種類型的拖放項目的標識符。在這裡，我們只接受 ItemType.APPLICANT 類型的項目。
- drop 屬性是一個函數，這個函數在一個拖放項目被放下時被調用。在這裡，我們檢查拖放項目是否存在，並且是否是從當前的列中拖出的。如果不是，則調用 handleDrop 函數，並傳入拖放項目的來源列和 ID。
- collect 屬性是一個函數，這個函數返回一個對象，這個對象的屬性會被合併到 useDrop Hook 的返回值中。在這裡，我們返回一個對象，這個對象包含一個 isOver 屬性，這個屬性表示是否有一個拖放項目正在懸停在這個放置區上。
- 最後，這個 Hook 返回一個包含 isOver 和 dropRef 的對象。isOver 是一個布林值，表示是否有一個拖放項目正在懸停在這個放置區上，dropRef 是一個可以被附加到 DOM 元素上的參考，使得這個元素成為一個可以接受拖放項目的放置區。

這個 Hook 的主要目的是為了實現任務的拖放功能，並且在拖放過程中，能夠根據拖放項目的來源列和 ID 來更新任務的位置。