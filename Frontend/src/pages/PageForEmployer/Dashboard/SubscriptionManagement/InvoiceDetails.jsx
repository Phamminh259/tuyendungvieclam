import React from 'react';
import { Modal, Spin, Button } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import RobotoSerifRegular from '../../../../assets/fonts/Roboto/static/RobotoSerif-Regular.ttf';

const getReadableStatus = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Cho thanh toan';
    case 'PAID':
      return 'Da thanh toan';
    case 'CANCELLED':
      return 'Da huy';
    default:
      return 'Khong xac dinh';
  }
};

const InvoiceDetails = ({ visible, onClose, invoice }) => {
  const handleExportInvoice = () => {
    const doc = new jsPDF();
    doc.addFileToVFS('RobotoSerif-Regular.ttf', RobotoSerifRegular);
    doc.addFont('RobotoSerif-Regular.ttf', 'RobotoSerif', 'normal');
    doc.setFont('RobotoSerif-Regular');
    
    doc.text('Chi tiet hoa don', 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Thong tin', 'Chi tiet']],
      body: [
        ['Ma hoa don', invoice.code],
        ['So hoa don', invoice.invoiceNumber],
        ['So tien', `${invoice.amount?.toLocaleString('vi-VN')} VND`],
        ['Ngay phat hanh', new Date(invoice.issueDate).toLocaleDateString('vi-VN')],
        ['Trang thai', getReadableStatus(invoice.status)],
        ['Mo ta', invoice.description],
        ['Ghi chu', invoice.note],
      ],
    });
    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  return (
    <Modal
      title="Chi tiet hoa don"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="export" type="primary" onClick={handleExportInvoice}>
          Xuat hoa don
        </Button>,
        <Button key="close" onClick={onClose}>
          Dong
        </Button>,
      ]}
    >
      {invoice ? (
        <div style={{ padding: '20px', fontSize: '16px', lineHeight: '1.6' }}>
          <p><strong>Ma hoa don:</strong> {invoice.code}</p>
          <p><strong>So hoa don:</strong> {invoice.invoiceNumber}</p>
          <p><strong>So tien:</strong> {invoice.amount?.toLocaleString('vi-VN')} VND</p>
          <p><strong>Ngay phat hanh:</strong> {new Date(invoice.issueDate).toLocaleDateString('vi-VN')}</p>
          <p><strong>Trang thai:</strong> {getReadableStatus(invoice.status)}</p>
          <p><strong>Mo ta:</strong> {invoice.description}</p>
          <p><strong>Ghi chu:</strong> {invoice.note}</p>
        </div>
      ) : (
        <Spin size="large" />
      )}
    </Modal>
  );
};

export default InvoiceDetails;
