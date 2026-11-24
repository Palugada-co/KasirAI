## UI Updates and OCR Bookkeeping Feature

### 1. Chatbot Branding
- Replace every occurrence of **"KasirAI"** with **"PaluPay"** throughout the chatbot interface.
- Ensure the chatbot name, welcome messages, labels, and other related UI text consistently use "PaluPay".

### 2. Menu Cleanup
- Remove all sentences, descriptions, or text containing the word **"KasirAI"** from the menu interface.
- Do not remove unrelated menu items or functionality.

### 3. Icon Replacement
- Replace the existing UI icons with the appropriate icon assets available in `D:\VentureProject\public`.
- Inspect the available assets and use icons that best match their respective UI elements.
- Maintain consistent icon sizing, alignment, and visual style throughout the application.
- Do not replace icons with unrelated images or assets.

### 4. OCR Bookkeeping Feature (UI Prototype)

Develop a frontend-only OCR feature that allows users to scan or upload images of handwritten bookkeeping records, such as daily sales or purchase logs.

The feature does not need a fully functional OCR engine or backend integration. Focus on building the user interface and simulating the OCR extraction process using mock/sample data.

**Expected UI:**

After the user uploads or scans a bookkeeping image, display the extracted transaction items in a structured format, similar to a receipt:

**Kopi Susu Gula Aren**  
1 × Rp 18,000　　　　　　　　　　　　 **Rp 18,000**

**Nasi Goreng Spesial**  
1 × Rp 32,000　　　　　　　　　　　　 **Rp 32,000**

**Cinnamon Roll Glaze**  
1 × Rp 22,000　　　　　　　　　　　　 **Rp 22,000**

**Required UI Elements:**
- Image upload or camera scan interface.
- OCR processing/loading simulation.
- Extracted transaction list containing item names, quantities, unit prices, and subtotals.
- Automatically calculated total transaction amount.
- Ability to review and edit extracted transaction data before saving.
- A confirmation or save action after reviewing the extracted data.

**Implementation Constraints:**
- Keep the implementation frontend-only.
- Use mock/sample data to simulate OCR results.
- Do not implement an actual OCR engine or backend integration.
- Ensure all UI interactions work, including editing quantities, prices, item names, and recalculating subtotals and totals.
- Follow the existing application's design system and component structure.

**Important:** Preserve all existing features and functionality outside the requested changes. Avoid unnecessary modifications to unrelated pages or components.