import { jsPDF } from 'jspdf';
import { Order } from '../types';

export const generateReceiptHtml = (order: Order): string => {
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const subtotal = order.subtotalNGN || (order.totalNGN - (order.deliveryFeeNGN || 500) - (order.serviceFeeNGN || 150));
  const delivery = order.deliveryFeeNGN !== undefined ? order.deliveryFeeNGN : 500;
  const service = order.serviceFeeNGN || 150;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Receipt_Order_${order.id}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #2c2221;
      background: #ffffff;
      margin: 0;
      padding: 0;
      line-height: 1.4;
      font-size: 13px;
    }
    .receipt-container {
      max-width: 680px;
      margin: 0 auto;
      padding: 28px;
      border: 1px solid #ebdcd8;
      border-radius: 16px;
      background: #ffffff;
    }
    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f09a8e;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #f09a8e;
    }
    .doc-title {
      font-size: 22px;
      font-weight: 800;
      color: #2c2221;
      margin: 4px 0 2px 0;
      font-family: Georgia, serif;
    }
    .sub-tag {
      font-size: 11px;
      color: #735853;
    }
    .badge-paid {
      background: #e6f4ea;
      color: #137333;
      border: 1px solid #ceebd6;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      display: inline-block;
    }
    .meta-details {
      text-align: right;
      font-size: 11px;
      color: #555555;
    }
    .meta-ref {
      font-family: monospace;
      font-weight: bold;
      color: #2c2221;
      margin-top: 4px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #faf5f4;
      border: 1px solid #ebdcd8;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
      font-size: 12px;
    }
    .info-block-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #a37068;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
    }
    .student-name {
      font-size: 14px;
      font-weight: 700;
      color: #2c2221;
      margin-bottom: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 12px;
    }
    th {
      background: #faf5f4;
      color: #a37068;
      font-weight: 700;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid #ebdcd8;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #f2e9e7;
      vertical-align: middle;
    }
    .item-name {
      font-weight: 700;
      color: #2c2221;
    }
    .item-meta {
      font-size: 11px;
      color: #777;
    }
    .totals-area {
      margin-left: auto;
      width: 280px;
      font-size: 12px;
      margin-bottom: 24px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      color: #555;
    }
    .total-grand {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 800;
      color: #2c2221;
      border-top: 2px solid #2c2221;
      padding-top: 8px;
      margin-top: 6px;
    }
    .stamp-footer {
      border-top: 1px dashed #d8c2bd;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #666;
    }
    .stamp-box {
      border: 1px solid #d8c2bd;
      background: #faf5f4;
      padding: 6px 12px;
      border-radius: 8px;
      text-align: center;
      font-family: monospace;
      font-size: 10px;
      color: #a37068;
      font-weight: bold;
    }
    @media print {
      body { padding: 0; }
      .receipt-container { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header-banner">
      <div>
        <div class="brand-title">Dwell &amp; Decor Campus Store</div>
        <div class="doc-title">OFFICIAL RECEIPT</div>
        <div class="sub-tag">Paystack Verified Student Order</div>
      </div>
      <div class="meta-details">
        <span class="badge-paid">PAYMENT VERIFIED</span>
        <div class="meta-ref">Ref: ${order.paystackRef}</div>
        <div style="margin-top:2px;">Order ID: #${order.id}</div>
        <div>Date: ${formattedDate}</div>
      </div>
    </div>

    <div class="info-grid">
      <div>
        <div class="info-block-title">Student Customer</div>
        <div class="student-name">${order.customer.fullName}</div>
        <div>${order.customer.email}</div>
        <div>${order.customer.phone}</div>
      </div>
      <div>
        <div class="info-block-title">Fulfillment details (School Pickup)</div>
        <strong style="color:#137333;">Store Owner Room Pickup (₦500):</strong><br>
        ${order.ownerRoomAddress || 'Queen Elizabeth Hall, Room 204, Block A'}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Unit Price</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(i => `
          <tr>
            <td>
              <div class="item-name">${i.product.name}</div>
              ${i.selectedColor ? `<div class="item-meta">Color option: ${i.selectedColor}</div>` : ''}
            </td>
            <td style="text-align:center; font-weight:bold;">${i.quantity}</td>
            <td style="text-align:right;">₦${i.product.priceNGN.toLocaleString()}</td>
            <td style="text-align:right; font-weight:bold;">₦${(i.product.priceNGN * i.quantity).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals-area">
      <div class="total-row">
        <span>Items Subtotal:</span>
        <span>₦${subtotal.toLocaleString()}</span>
      </div>
      <div class="total-row">
        <span>School Pickup (Owner's Room Fee):</span>
        <span>₦${delivery.toLocaleString()}</span>
      </div>
      <div class="total-row">
        <span>Processing Fee:</span>
        <span>₦${service.toLocaleString()}</span>
      </div>
      <div class="total-grand">
        <span>Total Paid:</span>
        <span>₦${order.totalNGN.toLocaleString()}</span>
      </div>
    </div>

    <div class="stamp-footer">
      <div>
        <strong>Official Dwell &amp; Decor Stamp</strong><br>
        Trace-free wall mounting materials included with order.
      </div>
      <div class="stamp-box">
        VERIFIED PAYMENT<br>
        DWELL &amp; DECOR
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Generates and triggers instant download of a genuine PDF receipt file using jsPDF
 */
export const downloadReceiptPDF = (order: Order): void => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let y = 16;

    // Header Background Accent
    doc.setFillColor(44, 34, 33); // #2c2221
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 26, 3, 3, 'F');

    // Header Brand Name
    doc.setTextColor(240, 154, 142); // #f09a8e
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('DWELL & DECOR', margin + 6, y + 8);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('CAMPUS STORE & DORM ROOM INTERIORS', margin + 6, y + 14);

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(7.5);
    doc.text('Official Order Receipt & Verified Invoice', margin + 6, y + 20);

    // Status Badge on Right Header
    doc.setFillColor(19, 115, 51); // Emerald Green
    doc.roundedRect(pageWidth - margin - 46, y + 5, 40, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('STATUS: PAID', pageWidth - margin - 26, y + 10.5, { align: 'center' });

    y += 32;

    // Order Metadata Grid Box
    doc.setFillColor(250, 245, 244); // #faf5f4
    doc.setDrawColor(235, 220, 216); // #ebdcd8
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 24, 2, 2, 'FD');

    doc.setTextColor(163, 112, 104); // #a37068
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('ORDER NUMBER', margin + 4, y + 6);
    doc.text('PAYSTACK REFERENCE', margin + 50, y + 6);
    doc.text('DATE & TIME', margin + 115, y + 6);

    doc.setTextColor(44, 34, 33);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`#${order.id}`, margin + 4, y + 13);
    doc.text(order.paystackRef || 'N/A', margin + 50, y + 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const dateFormatted = new Date(order.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(dateFormatted, margin + 115, y + 13);

    y += 29;

    // Customer & Pickup Details (2 side-by-side boxes)
    const colWidth = (pageWidth - (margin * 2) - 4) / 2;

    // Left: Customer Info
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(235, 220, 216);
    doc.roundedRect(margin, y, colWidth, 30, 2, 2, 'FD');

    doc.setTextColor(163, 112, 104);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('STUDENT CUSTOMER', margin + 4, y + 6);

    doc.setTextColor(44, 34, 33);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(order.customer.fullName || 'Student Customer', margin + 4, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90, 80, 80);
    doc.text(`Email: ${order.customer.email || 'N/A'}`, margin + 4, y + 18);
    doc.text(`Phone: ${order.customer.phone || 'N/A'}`, margin + 4, y + 23);
    if (order.customer.dormHall) {
      doc.text(`Hostel: ${order.customer.dormHall}, ${order.customer.roomNumber || ''}`, margin + 4, y + 28);
    }

    // Right: Fulfillment (School Pickup Fee ₦500)
    const rightColX = margin + colWidth + 4;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(235, 220, 216);
    doc.roundedRect(rightColX, y, colWidth, 30, 2, 2, 'FD');

    doc.setTextColor(163, 112, 104);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('FULFILLMENT: SCHOOL PICKUP (FIXED FEE N500)', rightColX + 4, y + 6);

    doc.setTextColor(19, 115, 51);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Store Owner Room Pickup Location:', rightColX + 4, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    const pickupAddr = order.ownerRoomAddress || 'Queen Elizabeth Hall, Room 204, Block A, Main Campus';
    const splitAddr = doc.splitTextToSize(pickupAddr, colWidth - 8);
    doc.text(splitAddr, rightColX + 4, y + 18);

    y += 35;

    // Items Breakdown Table Header
    doc.setFillColor(44, 34, 33);
    doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('ITEM DESCRIPTION', margin + 4, y + 5);
    doc.text('QTY', margin + 110, y + 5, { align: 'center' });
    doc.text('UNIT PRICE', margin + 140, y + 5, { align: 'right' });
    doc.text('TOTAL', pageWidth - margin - 4, y + 5, { align: 'right' });

    y += 7;

    // Table Rows
    const subtotal = order.subtotalNGN || (order.totalNGN - (order.deliveryFeeNGN || 500) - (order.serviceFeeNGN || 150));
    const deliveryFee = order.deliveryFeeNGN !== undefined ? order.deliveryFeeNGN : 500;
    const serviceFee = order.serviceFeeNGN || 150;

    order.items.forEach((item, index) => {
      const rowHeight = 8;
      const isEven = index % 2 === 0;

      doc.setFillColor(isEven ? 255 : 250, isEven ? 255 : 248, isEven ? 255 : 247);
      doc.rect(margin, y, pageWidth - (margin * 2), rowHeight, 'F');

      doc.setTextColor(44, 34, 33);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      
      const itemName = item.product.name.length > 45 ? item.product.name.substring(0, 42) + '...' : item.product.name;
      doc.text(itemName, margin + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(String(item.quantity), margin + 110, y + 5, { align: 'center' });
      doc.text(`NGN ${item.product.priceNGN.toLocaleString()}`, margin + 140, y + 5, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.text(`NGN ${(item.product.priceNGN * item.quantity).toLocaleString()}`, pageWidth - margin - 4, y + 5, { align: 'right' });

      y += rowHeight;
    });

    y += 4;

    // Totals Box on Right
    const totalsWidth = 80;
    const totalsX = pageWidth - margin - totalsWidth;

    doc.setFillColor(250, 245, 244);
    doc.setDrawColor(235, 220, 216);
    doc.roundedRect(totalsX, y, totalsWidth, 32, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);

    doc.text('Items Subtotal:', totalsX + 4, y + 6);
    doc.text(`NGN ${subtotal.toLocaleString()}`, totalsX + totalsWidth - 4, y + 6, { align: 'right' });

    doc.text('School Pickup Fee (Owner Room):', totalsX + 4, y + 12);
    doc.text(`NGN ${deliveryFee.toLocaleString()}`, totalsX + totalsWidth - 4, y + 12, { align: 'right' });

    doc.text('Processing & Handling Fee:', totalsX + 4, y + 18);
    doc.text(`NGN ${serviceFee.toLocaleString()}`, totalsX + totalsWidth - 4, y + 18, { align: 'right' });

    // Grand Total Line
    doc.setDrawColor(44, 34, 33);
    doc.setLineWidth(0.5);
    doc.line(totalsX + 4, y + 22, totalsX + totalsWidth - 4, y + 22);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(44, 34, 33);
    doc.text('TOTAL PAID:', totalsX + 4, y + 28);
    doc.text(`NGN ${order.totalNGN.toLocaleString()}`, totalsX + totalsWidth - 4, y + 28, { align: 'right' });

    y += 38;

    // Footer Guarantee Stamp Box
    doc.setDrawColor(235, 220, 216);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 22, 2, 2, 'FD');

    doc.setTextColor(44, 34, 33);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('TRACE-FREE WALL SAFE GUARANTEE', margin + 6, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(110, 95, 92);
    doc.text('All student dorm decor includes damage-free mounting strips. Show this receipt on pickup.', margin + 6, y + 13);
    doc.text('Store WhatsApp Assistance: 08123456789 • Dwell & Decor Campus Hub', margin + 6, y + 18);

    // Official Stamp Stamp
    doc.setDrawColor(240, 154, 142);
    doc.roundedRect(pageWidth - margin - 38, y + 4, 32, 14, 1.5, 1.5, 'D');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(240, 154, 142);
    doc.text('OFFICIAL STAMP', pageWidth - margin - 22, y + 9, { align: 'center' });
    doc.setTextColor(44, 34, 33);
    doc.text('VERIFIED ORDER', pageWidth - margin - 22, y + 14, { align: 'center' });

    // Save actual PDF file
    doc.save(`Dwell_Decor_Receipt_${order.id}.pdf`);
  } catch (error) {
    console.error('Failed to generate jsPDF receipt, falling back to HTML download:', error);
    downloadReceiptFile(order);
  }
};

export const downloadReceiptFile = (order: Order) => {
  const html = generateReceiptHtml(order);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Dwell_Decor_Receipt_${order.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const printReceiptPDF = (order: Order) => {
  const html = generateReceiptHtml(order);

  // Remove previous print iframe if present
  const existingFrame = document.getElementById('receipt-print-iframe');
  if (existingFrame) {
    existingFrame.remove();
  }

  // Create isolated hidden iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'receipt-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '-9999';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();

    // Trigger native browser print dialog once content renders
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.error('Error triggering iframe print', e);
        window.print();
      }
    }, 350);
  } else {
    window.print();
  }
};
